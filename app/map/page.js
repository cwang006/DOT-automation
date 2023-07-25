"use client";

import Map from '@components/Map';

import { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import Link from "next/link";
import { useSearchParams } from 'next/navigation'

const map = () => {
    const [geocodedLocations, setGeocodedLocations] = useState([]);
    const searchParams = useSearchParams(); 

    useEffect(() => {
        const coordinates = searchParams.get('geocodedData');
        if (coordinates){
            setGeocodedLocations(coordinates);
        }
        // console.log("received", coordinates)
    }, [searchParams.get('geocodedData')])

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    })
    if (!isLoaded) {
        return <div> Loading... </div>
    }
    return (
        <>
        <Map geocodedLocations={geocodedLocations} />
        <Link href="/geocoding"> 
        <button>Import Intersctions</button>
        </Link>
        </>
    )
        
    
    
}
 
export default map;