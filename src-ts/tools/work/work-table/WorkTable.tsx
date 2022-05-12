import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react'
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom'

import { cacheChallengeId } from '../../../../src/autoSaveBeforeLogin' // TODO: move to src-ts
import {
    LoadingSpinner,
    routeRoot,
    Table,
    TableColumn,
    TabsNavbar,
    TabsNavItem,
    Work,
    WorkByStatus,
    workContext,
    WorkContextData,
    workGetGroupedByStatus,
    workGetStatusFilter,
    WorkStatus,
    WorkStatusFilter,
} from '../../../lib'

import { workDashboardTabs } from './work-nav.config'
import { WorkNoResults } from './work-no-results'
import { WorkListColumnField, workListColumns } from './work-table.config'
import styles from './WorkTable.module.scss'

const WorkTable: FC<{}> = () => {

    const workContextData: WorkContextData = useContext(workContext)
    const { hasWork, work, initialized }: WorkContextData = workContextData

    const [statusGroups, setStatusGroups]: [{ [status: string]: WorkByStatus } | undefined,
        Dispatch<SetStateAction<{ [status: string]: WorkByStatus } | undefined>>]
        = useState<{ [status: string]: WorkByStatus }>()

    const [tabs, setTabs]: [ReadonlyArray<TabsNavItem>, Dispatch<SetStateAction<ReadonlyArray<TabsNavItem>>>]
        = useState<ReadonlyArray<TabsNavItem>>([...workDashboardTabs])

    const [columns, setColumns]: [ReadonlyArray<TableColumn<Work>>, Dispatch<ReadonlyArray<TableColumn<Work>>>]
        = useState<ReadonlyArray<TableColumn<Work>>>([...workListColumns])

    const { statusKey }: Readonly<Params<string>> = useParams()
    const workStatusFilter: WorkStatusFilter | undefined = workGetStatusFilter(statusKey)

    const navigate: NavigateFunction = useNavigate()

    // it's super annoying that you have to define this hook before the conditionals
    // to return non-table results, but just another joy of react
    useEffect(() => {

        // if we don't have a status filter, we have a problem,
        // so don't do anything
        if (!workStatusFilter) {
            return
        }

        // init the status groups and set the tab badges
        initializeStatusGroups(initialized, work, statusGroups, setStatusGroups, tabs, setTabs)

        // if the status filter is all, just set the default columns
        if (workStatusFilter === WorkStatusFilter.all) {
            setColumns([...workListColumns])
            return
        }

        const filteredColumns: Array<TableColumn<Work>> = [...workListColumns]
        filteredColumns.splice(workListColumns.findIndex(c => c.label === WorkListColumnField.status), 1)
        setColumns(filteredColumns)
    }, [
        initialized,
        workStatusFilter,
    ])

    // if we couldn't find a workstatusfilter,
    // redirect to the dashboard
    if (!workStatusFilter) {
        navigate(routeRoot)
        return <></>
    }

    function onChangeTab(active: string): void {
        navigate(`${routeRoot}/${active}`)
    }

    function viewWorkDetails(selectedWork: Work): void {

        const isDraft: boolean = selectedWork.status === WorkStatus.draft

        if (isDraft) {
            cacheChallengeId(selectedWork.id)
        }

        // TODO: get these routes from an object/function that's not hard-coded
        const url: string = isDraft
            ? '/self-service/wizard'
            : `/self-service/work-items/${selectedWork.id}`

        navigate(url)
    }

    // define the tabs so they can be displayed on various results
    const tabsElement: JSX.Element = (
        <TabsNavbar
            tabs={tabs}
            defaultActive={workStatusFilter}
            onChange={onChangeTab}
        />
    )

    // if we haven't loaded the work yet, render the spinner
    if (!initialized) {
        return (
            <>
                {tabsElement}
                <div className={styles.loader}>
                    <LoadingSpinner />
                </div>
            </>
        )
    }

    // if we don't have any work at all, render no results
    if (!hasWork) {
        return <WorkNoResults filtered={false} />
    }

    // get the filtered list
    const filteredResults: ReadonlyArray<Work> | undefined = statusGroups?.[workStatusFilter].results

    // if we don't have any work after filtering, render no results
    if (!filteredResults?.length) {
        return (
            <>
                {tabsElement}
                <WorkNoResults filtered={true} />
            </>
        )
    }

    const workList: Array<Work> = [...filteredResults]
        // sort by the default sort,
        // which is descending by created date
        .sort((a: Work, b: Work) => b.created.getTime() - a.created.getTime())

    return (
        <>
            {tabsElement}
            <Table
                columns={columns}
                data={workList}
                onRowClick={viewWorkDetails}
            />
        </>
    )
}

export default WorkTable

function initializeStatusGroups(
    initialized: boolean,
    work: ReadonlyArray<Work>,
    statusGroups: { [status: string]: WorkByStatus } | undefined,
    setStatusGroups: Dispatch<SetStateAction<{ [status: string]: WorkByStatus } | undefined>>,
    tabs: ReadonlyArray<TabsNavItem>,
    setTabs: Dispatch<SetStateAction<ReadonlyArray<TabsNavItem>>>
): void {

    // if we're not initialized or we already have status groups,
    // nothing else to do
    if (!initialized || !!statusGroups) {
        return
    }

    const groups: { [status: string]: WorkByStatus } = workGetGroupedByStatus(work)
    setStatusGroups(groups)

    // set the count tab badges
    const badgedTabs: ReadonlyArray<TabsNavItem> = [...tabs]
    badgedTabs
        // don't add badges for done or all
        .filter(tab => ![WorkStatusFilter.all, WorkStatusFilter.done]
            .includes(WorkStatusFilter[tab.id as keyof typeof WorkStatusFilter]))
        .forEach(tab => {
            const info: WorkByStatus = groups[tab.id]
            if (!!info.count) {
                tab.badges = [
                    {
                        count: info.count,
                        type: 'important',
                    },
                ]
            }
        })
    setTabs(badgedTabs)
}
