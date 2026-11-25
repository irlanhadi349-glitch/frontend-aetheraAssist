import Link from "next/link"
export default function HeaderAdmin(){
    return(
        <div className="hidden md:flex md:w-full  h-10  items-center justify-between px-8 ">
            <h2 className="text-xl font-bold ">Aethera <span className="text-warna-2">Assist</span></h2>
            <div className="flex gap-6 mr-3">
             <Link href="akun" className="flex gap-1 hover:border-b "><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                                </svg>Akun</Link>
             <Link href="akun" className="flex gap-1 hover:border-b "><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>Logout</Link>
            </div>
            

        </div>
    )
}