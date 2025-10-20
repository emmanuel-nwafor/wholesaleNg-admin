import { ChevronDown } from 'lucide-react'
import React from 'react'

export default function Header() {
  return (
    <>
        <div className="bg-white shadow-sm p-5 flex items-center justify-between">
            <h1 className='font-bold text-sm'>
                Dashboard
            </h1>

            <div className="">
                <div className="flex items-center justify-between w-[200px]">
                    <div className="flex items-center">
                        <img src="https://i.pinimg.com/736x/ed/f2/f0/edf2f0344a86c77a821e9cb711b21ec0.jpg" className="m-1 h-10 w-10 rounded-full object-cover" alt="profile_image" />
                        <p className='text-sm'>
                            Joanna Adeleke
                        </p>
                    </div>

                    <ChevronDown />
                </div>
            </div>
        </div>
    </>
  )
}
