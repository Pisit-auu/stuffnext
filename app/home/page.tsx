'use client'

import { useState, FormEvent, useEffect } from 'react'
import { signIn, SignInResponse } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link';
import Image from "next/image";

export default function SignIn() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const [redirectUrl, setRedirectUrl] = useState<string>('/')

  // ฟังก์ชันเข้าสู่ระบบ
  const handleSignInSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage('Both fields are required');
      return;
    }
  
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
  
      if (!result) {
        setErrorMessage('Sign-in failed. Please try again.');
        return;
      }
  
      if (result.error) {
        setErrorMessage(result.error);
      } else {
        router.push(redirectUrl);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสมัครสมาชิก
  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setErrorMessage('Both fields are required')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/auth/signup', { username, password })
      router.push('/login')
    } catch (error) {
      setErrorMessage('Sign Up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
  


    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

        {/* Content Top */}
        <div className="flex flex-col md:flex-row-reverse items-center w-full max-w-5xl flex-grow  p-16">
            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-end">
                <Image
                    src="/" 
                    alt="Picture of the school"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md"
                />
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 text-left md:pl-12">
                <h1 className="text-5xl font-bold text-blackblue_111827 hover:text-black transition duration-100">
                ▎StuffNext
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    This is the website for managing equipment within Srinakharinwirot School. 
                    You can visit the school's main website here.
                </p>
                <div className="flex justify-start">
                    <button
                    type="submit"
                    className="w-24 bg-yellow-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300 mt-8"
                    >
                    Let's go
                    </button>
                </div>
            </div>

        </div>
    

        {/* Content Center */}
        <div className="flex flex-col items-center w-full h-auto bg-gray-200 rounded-lg	pb-20">
            <h1 className="text-5xl font-extrabold text-gray-800	 transition duration-100 mt-20">
                    StuffNext's Features
            </h1>
            <p className="mt-2 text-lg text-gray-600">
                Choose the features that enchance the efficiency of managing school assets
            </p>
            
            <div className="flex flex-row item-center  mt-16 space-x-10">

                <Link href="#">
                    <div className=" rounded-lg hover:bg-blue-200">    
                        <Image
                            src="/" 
                            alt="Button Icon"
                            width={200} 
                            height={200} 
                            className="bg-white rounded-lg shadow-md" 
                        />
                        <div className="mt-12 text-xl text-blackblue_111827 text-center font-semibold	" >BORROW</div>
                    </div>
                </Link>

                <Link href="#">
                    <div className=" rounded-lg hover:bg-blue-200">    
                        <Image
                        src="/" 
                        alt="Button Icon"
                        width={200} 
                        height={200} 
                        className="bg-white rounded-lg shadow-md" 
                        />
                        <div className="mt-12 text-xl text-blackblue_111827 text-center font-semibold	" >RETURN</div>
                    </div>
                </Link>
                
                
                <Link href="#">
                    <div className=" rounded-lg hover:bg-blue-200">    
                        <Image
                        src="/" // เปลี่ยนเป็นไฟล์จริง
                        alt="Button Icon"
                        width={200} // ขนาดของรูป
                        height={200} // ขนาดของรูป
                        className="bg-white rounded-lg shadow-md" // เพิ่มระยะห่างจากข้อความ
                        />
                        <div className="mt-12 text-xl text-blackblue_111827 text-center font-semibold" >USER STATUS</div>
                    </div>
                </Link>
            </div>
 
        
        </div>


        {/* Content Bottom */}
        <div className="flex flex-col items-center w-full h-auto bg-blackblue_111827 rounded-lg	">
            <h1 className="text-5xl font-bold text-red-800	 transition duration-100 mt-20">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque recusandae ab aperiam sapiente sit vero amet delectus quisquam voluptatem adipisci.
            </h1>
        </div>

    </div>


    
    
    
 
       


    

  )
}
// 