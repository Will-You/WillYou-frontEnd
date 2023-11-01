'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookie';
import { PlanAPI } from '@/features/plan/dating';
import { UserProfile } from '@/types/match/type';
import Image from 'next/image';
import profiledog from '../../../../../../public/images/profiledog1.jpeg';
import { getUserProfileData } from '@/features/plan/dating';
import Write from '@/components/plan/Write';
import { getDateList } from '@/features/plan/dating';
import Link from 'next/link';
import BackIcon from '../../../../../../public/planIcon/back.svg';
import Header from '@/components/common/Header';

type Props = {
    params: {
        slug: string;
    };
};

interface DateItem {
    datingId: number;
    userId: number;
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
}

interface DatingInfo {
    datingTitle: string;
    datingLocation: string;
    datingTheme: string;
    activities: { activityContent: string }[]; // activities 배열을 추가합니다.
}

export default function PostPage({ params: { slug } }: Props) {
    const [dating, setDating] = useState<DatingInfo>();
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [isEditing, setIsEditing] = useState(false);
    const [dateList, setDateList] = useState<DateItem[]>([]);
    const [activities, setActivities] = useState([]);
    const [activePage, setActivePage] = useState(slug);
    const router = useRouter();

    useEffect(() => {
        axios
            .get(`https://willyouback.shop/api/dating/${slug}`, {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            })
            .then((response) => {
                const datingData = response.data.data;
                setDating({
                    datingTitle: datingData.datingTitle,
                    datingLocation: datingData.datingLocation,
                    datingTheme: datingData.datingTheme,
                    activities: datingData.activityResponseDtoList,
                });
                setActivities(datingData.activityResponseDtoList); // activities 상태 업데이트
                // 데이트를 작성한 사용자의 ID를 가져와서 프로필 정보를 불러옵니다.
                return getUserProfileData(datingData.userId);
            })
            .then((userData) => {
                setUserProfile(userData); // 프로필 데이터를 상태에 설정합니다.
                // 여기서 userId를 사용하여 getDateList를 호출합니다.
                return getDateList(userData.userId);
            })
            .then((dateListData) => {
                // dateListData를 사용하여 dateList 상태를 설정합니다.
                setDateList(dateListData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {});
    if (dating == undefined) {
        return;
    }

    const handleEditClick = () => {
        setIsEditing(true); // 수정 버튼을 클릭하면 isEditing 상태를 true로 설정합니다.
    };

    const handleEditComplete = () => {
        // 수정이 완료된 후 데이터를 다시 가져옵니다.
        axios
            .get(`https://willyouback.shop/api/dating/${slug}`, {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            })
            .then((response) => {
                const datingData = response.data;
                setDating({
                    datingTitle: datingData.data.datingTitle,
                    datingLocation: datingData.data.datingLocation,
                    datingTheme: datingData.data.datingTheme,
                    activities: datingData.data.activityResponseDtoList,
                });
                setIsEditing(false); // 그리고 isEditing 상태를 false로 설정합니다.
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const handleDeleteClick = () => {
        axios
            .delete(`https://willyouback.shop/api/dating/${slug}`, {
                headers: {
                    Authorization: getCookie('Authorization'),
                    Authorization_Refresh: getCookie('Authorization_Refresh'),
                },
            })
            .then((response) => {
                if (response.data.status === 'success') {
                    window.location.href = '/user/plan/myplan';
                } else {
                    console.error(
                        'Error deleting dating:',
                        response.data.message
                    );
                }
            })
            .catch((error) => {
                console.error('Error deleting dating:', error);
            });
    };

    const handleBackButtonClick = () => {
        history.back();
    };

    const handleImageClick = () => {
        if (userProfile && userProfile.userId) {
            const targetProfileUrl = `/user/profile/${userProfile.userId}`;
            router.push(targetProfileUrl); // Navigate to the target profile page when the image is clicked
        }
    };

    return (
        <>
            <Header />
            {!isEditing && (
                <div className="hidden sm:block">
                    <div
                        className="flex flex-row h-20 mb-4 items-center"
                        onClick={() => console.log('Parent clicked')}
                    >
                        <button onClick={handleBackButtonClick} className="p-4">
                            <BackIcon />
                        </button>
                        <p className="text-neutral-700 text-xl font-medium leading-tight tracking-wide mx-auto">
                            데이트 계획
                        </p>
                        <div
                            className="h-[45px] w-[45px] rounded-full overflow-hidden mr-2 z-50 pointer-events-auto"
                            onClick={handleImageClick}
                            onTouchStart={handleImageClick}
                        >
                            {userProfile &&
                            userProfile.profileImages &&
                            userProfile.profileImages.length > 0 ? (
                                <Image
                                    src={
                                        userProfile.profileImages[0].image || ''
                                    }
                                    alt="User profile image"
                                    width={231}
                                    height={231}
                                    priority
                                />
                            ) : (
                                <Image
                                    src={profiledog}
                                    alt="Default profile image"
                                    width={231}
                                    height={231}
                                    priority
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full mx-auto sm:p-0">
                {isEditing ? (
                    <Write
                        initialData={dating}
                        initialActivities={activities}
                        onEditComplete={handleEditComplete}
                    />
                ) : (
                    <>
                        <div className="flex flex-row">
                            <div className="w-[365px] my-auto ml-4 sm:hidden">
                                <ul>
                                    {dateList.map((date, index) => (
                                        <li
                                            key={index}
                                            className={`flex flex-col border-2 border-rgba(172, 172, 172, 0.69) w-[332px] h-[74px] px-2 pt-2 ${
                                                activePage ===
                                                date.datingId.toString()
                                                    ? 'bg-[#F9ECFF]'
                                                    : ''
                                            }`}
                                            style={{
                                                borderRadius: '4px 0px 0px 4px',
                                            }}
                                            onClick={() =>
                                                setActivePage(
                                                    date.datingId.toString()
                                                )
                                            }
                                        >
                                            <Link href={`${date.datingId}`}>
                                                <div
                                                    className={`font-bold-500 text-[24px] ${
                                                        activePage ===
                                                        date.datingId.toString()
                                                            ? 'text-black'
                                                            : ''
                                                    }`}
                                                >
                                                    <span>
                                                        {date.datingTitle}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`text-[#aaa] mt-2 text-xs text-end ${
                                                        activePage ===
                                                        date.datingId.toString()
                                                            ? 'text-black'
                                                            : ''
                                                    }`}
                                                >
                                                    <span>
                                                        데이트 계획을 생성한
                                                        날짜
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col w-full border-l-[2px] border-r-[2px] border-[#C5C5C5] sm:border-none">
                                <div className="flex flex-col mt-28 mx-auto p-4 w-5/6 border-b-2 border-[#C5C5C5] sm:border-dashed sm:border-b-2 sm:border-[#D57DFF] sm:max-w-[350px] sm:mt-0 sm:w-full">
                                    <div className="flex flex-col p-4">
                                        <p className="text-[25px] text-[#666666] sm:text-base sm:font-medium">
                                            {dating.datingLocation}
                                        </p>
                                        <p className="text-[36px] mt-1 mb-4 font-semibold sm:text-xl sm:font-medium sm:my-4">
                                            {dating.datingTitle}
                                        </p>
                                        <p className="text-[25px] sm:text-lg sm:font-medium">
                                            {dating.datingTheme}
                                        </p>
                                        <p className="text-[#aaa] mt-10 text-xs text-end sm:order-first sm:text-start sm:mb-8 sm:mt-0">
                                            작성시간
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col mx-auto p-4 w-5/6 sm:w-full ">
                                    <div className="flex-col items-center p-4 w-full">
                                        <p className="flex justify-center mb-10 text-[30px]">
                                            데이트 내용 🎈
                                        </p>
                                        {dating &&
                                            dating.activities.map(
                                                (
                                                    activity,
                                                    index // activities 배열을 매핑합니다.
                                                ) => (
                                                    <div
                                                        key={index}
                                                        className="p-2 my-2 border-[3px] border-[#D67DFFCC] rounded-lg sm:border-[2px] sm:w-[327px]"
                                                    >
                                                        {
                                                            activity.activityContent
                                                        }
                                                    </div>
                                                )
                                            )}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-end w-5/6 gap-4  ml-10 text-[24px] sm:hidden">
                                    <button
                                        className="bg-myplan-button w-[102px] h-[50px] text-white rounded-[30px]"
                                        onClick={handleEditClick}
                                    >
                                        수정
                                    </button>
                                    <button
                                        className="bg-myplan-button w-[102px] h-[50px] text-white rounded-[30px]"
                                        onClick={handleDeleteClick}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                            <div className="w-[394px] sm:hidden">
                                <div className="h-screen w-[395px] flex flex-col items-center">
                                    <div className="h-[231px] w-[231px] rounded-full overflow-hidden mx-auto mt-[136px]">
                                        {/* {userProfile &&
                                    userProfile.profileImages &&
                                    userProfile.profileImages.length > 0 ? (
                                        <Image
                                            src={
                                                userProfile.profileImages[0]
                                                    .image || ''
                                            }
                                            alt="User profile image"
                                            width={231}
                                            height={231}
                                            priority
                                        />
                                    ) : (
                                        <Image
                                            src={profiledog}
                                            alt="Default profile image"
                                            width={231}
                                            height={231}
                                            priority
                                        />
                                    )} */}
                                    </div>
                                    <div>
                                        {/* {userProfile && (
                                        <div>
                                            <h2>{userProfile.nickname}</h2>
                                            <p>나이: {userProfile.age}</p>
                                            <p>성별 : {userProfile.gender}</p>
                                            <p>MBTI : {userProfile.mbti}</p>
                                            <p>
                                                학력 : {userProfile.education}
                                            </p>
                                        </div>
                                    )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
