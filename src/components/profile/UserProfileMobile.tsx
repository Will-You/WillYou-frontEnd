'use client'
import { MyProfileRes } from '@/types/profile'
import Image from 'next/image';
import React, { useState } from 'react'
import LocationIcon from "../../../public/profileIcon/location.svg"
import EducationIcon from "../../../public/profileIcon/graduationcap.fill.svg"
import Link from 'next/link';
import { eraseCookie } from '@/utils/cookie';
import { useRouter } from 'next/navigation';

type Props = {
    profile : MyProfileRes;
}
function UserProfileMobile({profile}:Props) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const router = useRouter();
    const logout = () => {
        eraseCookie('Authorization');
        eraseCookie('Authorization_Refresh');
        eraseCookie('status');
        sessionStorage.clear();
        alert('로그아웃 처리되었습니다.');
        router.push('/');
    };


  return (
    <div>
        <div className='h-[80vh] bg-custom-gradient rounded-3xl p-4 relative mt-20 w-full flex justify-center'>
            <div className='absolute -top-0 -mt-20'>
            {/* 유저 이미지 태그 */}
                <div className='relative h-[146px] w-[146px]'>
                    {profile && <Image src={profile?.profileImages[0].image} alt='프로필 이미지' fill style={{objectFit:'cover'}} className='rounded-full' />}
                </div>
            </div>
        <div className='flex flex-col mt-16 w-full items-center'>
          <div className='text-zinc-800 text-2xl font-semibold'>{profile.nickname}, {profile.age}</div>
            <div className='p-6 bg-white h-[181px] w-full mt-10 rounded-2xl flex flex-col gap-3'>
                {!profile.location && !profile.education && !profile.mbti && !profile.religion ? 
                    <p className="text-center">작성된 내용이 없습니다.</p> 
                    : 
                    <>
                        { profile.education ? <div className='flex items-center gap-2'><EducationIcon/>{profile.education}</div> : null }
                        { profile.location ? <div className='flex items-center gap-2'><LocationIcon/>{profile.location}</div> : null }
                        <div className='flex items-center gap-4'>
                        { profile.mbti ? <div className='px-3 py-1 border-[#d67dff] border-2 rounded-3xl'>{profile.mbti}</div> : null }
                        { profile.religion ? <div className='px-3 py-1 border-[#d67dff] border-2 rounded-3xl'>{profile.religion}</div> : null }
                        </div>
                    </>
                }
            </div>
            <Link href={'/profile/edit'}>
                <button className='mx-auto px-4 py-2 bg-[#D67dff] mt-4 w-20 rounded-3xl text-white font-bold hover:bg-pink-300'>수정</button>
            </Link>
            <div className='mt-4 w-full rounded-2xl bg-white p-6 h-20 flex flex-col items-start justify-center text-gray-400 gap-1'>
                <p className='cursor-pointer' onClick={()=>router.push('/')}>비밀번호 변경</p>
                <hr className='w-full'/>
                <p onClick={()=>setShowLogoutModal(true)} className='cursor-pointer'>로그아웃</p>
            </div>

            {showLogoutModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* 모달 외부 배경 (그레이 오버레이) */}
                    <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={() => setShowLogoutModal(false)}></div>
                    
                    {/* 모달 창 */}
                    <div className="bg-white p-2 rounded-xl shadow-lg w-64 z-10 h-32 flex flex-col items-center justify-center">
                        <div>로그아웃 할까요?</div>
                        <div className="flex justify-between mt-4 w-full px-6">
                            <button onClick={() => setShowLogoutModal(false)} className="mr-2 px-4 py-2 rounded">취소</button>
                            <button onClick={() => { logout(); setShowLogoutModal(false); }} className="px-4 py-2 bg-gray-200 bg-opacity-70 rounded-lg">확인</button>
                        </div>
                    </div>
                </div>
            )}
            <div className='mt-4 w-full rounded-2xl bg-white p-6 h-10 flex flex-col items-start justify-center text-[#cb17f9]'>
                회원탈퇴
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserProfileMobile