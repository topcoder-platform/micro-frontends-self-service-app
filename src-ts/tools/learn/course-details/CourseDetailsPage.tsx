import { FC, useMemo } from 'react'
import { Params, useParams } from 'react-router-dom'

import {
    Breadcrumb,
    BreadcrumbItemModel,
    IconOutline,
    LoadingSpinner,
} from '../../../lib'
import { CourseTitle } from '../components'
import {
    CoursesProviderData,
    MyCertificationProgressProviderData,
    useCoursesProvider,
    useMyCertificationProgress,
} from '../services'

import { CourseCurriculum } from './course-curriculum'
import styles from './CourseDetailsPage.module.scss'
import { PromoCourse } from './promo-course'

interface CourseDetailsPageProps {
}

const CourseDetailsPage: FC<CourseDetailsPageProps> = (props: CourseDetailsPageProps) => {
    const routeParams: Params<string> = useParams()

    const {
        course,
        ready,
    }: CoursesProviderData = useCoursesProvider(routeParams.certification)

    const { progress }: MyCertificationProgressProviderData = useMyCertificationProgress(routeParams.certification)

    const breadcrumb: Array<BreadcrumbItemModel> = useMemo(() => [
        { url: '/learn', name: 'Topcoder Academy' },
        { url: `/learn/${course?.certification}`, name: course?.title ?? '' },
    ], [course?.certification])

    return (
        <>
            {!ready && (
                <div className={styles['wrap']}>
                    <LoadingSpinner />
                </div>
            )}
            <Breadcrumb items={breadcrumb} />
            {ready && course && (
                <>
                    <div className={styles['wrap']}>
                        <div className={styles['main']}>
                            <div className={styles['description']}>
                                <CourseTitle size='lg' title={course.title} credits={course?.provider} type='webdev' />

                                <div
                                    className={styles['text']}
                                    dangerouslySetInnerHTML={{ __html: course.introCopy.join('<br /><br />') }}
                                ></div>

                                {progress?.status === 'completed' ? (
                                    <>
                                        <h3 className='details'>Suggested next steps</h3>

                                        <div className={styles['text']}>
                                            <p>Now that you have completed the {course.title}, we’d recommend you enroll in another course to continue your learning. You can view our other courses from the Topcoder Academy course page. </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className='details'>Why should you complete this course?</h3>

                                        <div className={styles['text']}>
                                            <p>In this Responsive Web Design course, you'll learn the languages that developers use to build webpages: HTML (Hypertext Markup Language) for content, and CSS (Cascading Style Sheets) for design.</p>
                                            <p>First, you'll build a cat photo app to learn the basics of HTML and CSS. Later, you'll learn modern techniques like CSS variables by building a penguin, and best practices for accessibility by building a web form.</p>
                                            <p>Finally, you'll learn how to make webpages that respond to different screen sizes by building a Twitter card with Flexbox, and a complex blog layout with CSS Grid.</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={styles['coming-soon']}>
                                <PromoCourse />
                            </div>
                        </div>
                        <div className={styles['aside']}>
                            <CourseCurriculum course={course} progress={progress} />
                        </div>
                    </div>
                    {course?.provider === 'freeCodeCamp' && (
                        <div className={styles['credits-link']}>
                            <a href='https://freecodecamp.org/' target='_blank' referrerPolicy='no-referrer'>
                                This course was created by the freeCodeCamp.org community.
                                <IconOutline.ExternalLinkIcon />
                            </a>
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default CourseDetailsPage
