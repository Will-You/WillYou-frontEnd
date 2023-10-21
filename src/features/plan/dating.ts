import axios from 'axios';
import { DatingResponse } from '@/types/plan/write/type';
import { getCookie } from '@/utils/cookie';

//? 데이트 계획 작성 (더미 데이터 만들기!)
export const createDating = async (
    title: string,
    location: string,
    theme: string
): Promise<DatingResponse> => {
    try {
        const response = await axios.post(
            'https://willyouback.shop/api/dating',
            {
                datingTitle: title,
                datingLocation: location,
                datingTheme: theme,
            },
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(
            `Failed to create dating: ${
                error.response?.data.message || error.message
            }`
        );
    }
};

//? 더미 데이터 수정하기!
export const updateDating = async (
    id: number,
    title: string,
    location: string,
    theme: string
): Promise<DatingResponse> => {
    try {
        const response = await axios.put(
            `https://willyouback.shop/api/dating/${id}`,
            {
                datingId: id,
                datingTitle: title,
                datingLocation: location,
                datingTheme: theme,
            },
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(
            `Failed to update dating: ${
                error.response?.data.message || error.message
            }`
        );
    }
};

//? 데이트 전체 조회
import { Dating, AllDatingResponse } from '../../types/plan/board/type';

export const getDatings = async () => {
    try {
        const response = await axios.get(
            'https://willyouback.shop/api/datings',
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching dating data:', error);
        throw error;
    }
};

//? 데이트 상세 조회?
export async function getDatingData(datingId: string) {
    try {
        const response = await axios.get(
            `https://willyouback.shop/api/dating/${datingId}`,
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching dating data:', error);
        throw error;
    }
}

//? 본인 데이트 계획인지 확인
export async function getDatingAuthorId(
    datingId: string
): Promise<number | null> {
    try {
        const response = await axios.get(
            `https://willyouback.shop/api/dating/${datingId}`,
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data.data.authorId; // 데이터의 작성자 ID를 반환합니다.
    } catch (error) {
        console.error('Error fetching dating data:', error);
        throw error;
    }
}

//? 활동 추가

import { Activity, ActivityResponse } from '../../types/plan/activity/type';

export const createActivity = async (
    datingId: number,
    activityTitle: string,
    activityContent: string
): Promise<ActivityResponse> => {
    try {
        const response = await axios.post<ActivityResponse>(
            `https://willyouback.shop/api/activity/${datingId}`,
            {
                activityTitle,
                activityContent,
            },
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(
            `Failed to create activity: ${
                error.response?.data.message || error.message
            }`
        );
    }
};

//? 활동삭제

export const deleteActivity = async (
    activityId: number
): Promise<ActivityResponse> => {
    try {
        const response = await axios.delete<ActivityResponse>(
            `https://willyouback.shop/api/activity/${activityId}`,
            {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(
            `Failed to delete activity: ${
                error.response?.data.message || error.message
            }`
        );
    }
};
