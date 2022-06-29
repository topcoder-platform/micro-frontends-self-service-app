import { xhrGetAsync, xhrPostAsync, xhrPutAsync } from '../../../../../lib/functions'
import { getPath } from '../../learn-url.config'

import { LearnMyCertificationProgress } from './learn-my-certification-progress.model'

export enum UPDATE_MY_CERTIFICATE_PROGRESS_ACTIONS {
    currentLesson = 'current-lesson',
    completeLesson = 'complete-lesson',
    completeCertificate = 'complete-certificate',
}

export function getMyCertificationsProgressAsync(userId: number, certification?: string): Promise<Array<LearnMyCertificationProgress>> {
    return xhrGetAsync<Array<LearnMyCertificationProgress>>(getPath(
        'certification-progresses',
        [
            `?userId=${userId}`,
            certification && `certification=${certification}`,
        ].filter(Boolean).join('&'),
    ))
}

export function startMyCertificationsProgressAsync(userId: number, certificationId: string, courseId: string, data: any): Promise<LearnMyCertificationProgress> {
    return xhrPostAsync<{}, LearnMyCertificationProgress>(getPath(
        'certification-progresses',
        `${userId}`,
        certificationId,
        courseId,
    ), data)
}

export function updateMyCertificationsProgressAsync(certificationProgressId: string, action: UPDATE_MY_CERTIFICATE_PROGRESS_ACTIONS, data: any): Promise<LearnMyCertificationProgress> {
    return xhrPutAsync<{}, LearnMyCertificationProgress>(getPath(
        'certification-progresses',
        certificationProgressId,
        action
    ), data)
}
