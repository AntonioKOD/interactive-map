'use client'
import AddLocationForm from "@/components/AddLocation";

export default function AddLocation() {
    return (
        <AddLocationForm onLocationAdded={() => { /* handle location added */ }} />
    )
}