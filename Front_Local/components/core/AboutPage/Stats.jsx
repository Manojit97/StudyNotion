import React from 'react'

const stat = [
    {count: "5K", label:"Active Students"},
    {count:"10+", label:"Mentors"},
    {count:"200+",label:"Courses"},
    {count:"50+",label:"Awards"},
];
const Stats = () => {
  return (
    <section className='bg-[#2C333F]'>
        <div className='flex flex-col gap-10 justify-between w-10/12 max-w-[1280px] text-white mx-auto '>
            <div className='grid grid-cols-2 md:grid-cols-4 text-center'>
                {
                    stat.map( (data, index)=>{
                        return (
                            <div key={index} className='flex flex-col py-10'>
                                    <h1 className='text-[30px] font-bold text-[#F1F2FF]'>
                                        {data.count}
                                    </h1>
                                    <h2 className='font-semibold text-[16px] text-[#585D69]'>
                                        {data.label}
                                    </h2>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </section>
  )
}

export default Stats