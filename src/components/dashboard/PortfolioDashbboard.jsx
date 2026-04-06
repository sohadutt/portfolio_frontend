import { useState, useEffect } from "react"
import { fetchDashboardPortfolios } from "@/helper/functions"
import { Toaster } from "@/components/ui/sonner"

export default function PortfolioDashboard(){
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        fetchDashboardPortfolios().then((res) =>{
            setData(res)
            setLoading(false)
        })
        .catch((err) =>{
            console.error('Portfolios Loading Error:', err)
            setLoading(false)
        })
    })

    if (loading) {
        return(
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Loading...
            </h2>
        )
    }
    return(
        <>
        </>
    )
}