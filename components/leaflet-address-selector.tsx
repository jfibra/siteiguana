"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Address {
  id?: number
  label?: string
  street: string
  street2?: string
  city: string
  state: string
  zip_code: string
  country: string
  latitude?: number
  longitude?: number
  formatted_address?: string
  is_verified: boolean
  is_primary: boolean
  type: string
}

interface AddressMapSelectorProps {
  onAddressSelect: (address: any) => void
  initialAddress?: Address
}

// Nominatim geocoding service (free OpenStreetMap service)
const geocodeAddress = async (query: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=5&addressdetails=1`,
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Geocoding error:", error)
    return []
  }
}

const reverseGeocode = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return null
  }
}

const extractAddressComponents = (place: any) => {
  const address = place.address || {}

  // Extract street number and street name
  const houseNumber = address.house_number || ""
  const street = address.road || address.street || ""
  const fullStreet = `${houseNumber} ${street}`.trim()

  return {
    street: fullStreet,
    city: address.city || address.town || address.village || "",
    state: address.state || address.region || "",
    zip_code: address.postcode || "",
    country: address.country || "United States",
    formatted_address: place.display_name || "",
  }
}

export default function LeafletAddressSelector({ onAddressSelect, initialAddress }: AddressMapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingMap, setIsLoadingMap] = useState(true)
  const { toast } = useToast()

  const initializeMap = useCallback(() => {
    if (typeof window !== "undefined" && window.L && mapRef.current) {
      const defaultCenter =
        initialAddress?.latitude && initialAddress?.longitude
          ? [initialAddress.latitude, initialAddress.longitude]
          : [40.7128, -74.006] // Default to NYC

      // Create map
      const map = window.L.map(mapRef.current).setView(defaultCenter, 13)

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add marker
      const marker = window.L.marker(defaultCenter, { draggable: true }).addTo(map)

      // Handle marker drag
      marker.on("dragend", async () => {
        const position = marker.getLatLng()
        const data = await reverseGeocode(position.lat, position.lng)
        if (data) {
          const addressComponents = extractAddressComponents(data)
          onAddressSelect({
            ...addressComponents,
            latitude: position.lat,
            longitude: position.lng,
          })
        }
      })

      // Handle map click
      map.on("click", async (e: any) => {
        marker.setLatLng(e.latlng)
        const data = await reverseGeocode(e.latlng.lat, e.latlng.lng)
        if (data) {
          const addressComponents = extractAddressComponents(data)
          onAddressSelect({
            ...addressComponents,
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
          })
        }
      })

      mapInstanceRef.current = map
      markerRef.current = marker
      setIsLoadingMap(false)
    }
  }, [initialAddress, onAddressSelect])

  useEffect(() => {
    // Load Leaflet CSS and JS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    if (!window.L) {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = initializeMap
      document.head.appendChild(script)
    } else {
      initializeMap()
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [initializeMap])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await geocodeAddress(searchQuery)
      setSearchResults(results)

      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different search term or be more specific",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Search error",
        description: "Failed to search for address",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectSearchResult = (result: any) => {
    const lat = Number.parseFloat(result.lat)
    const lon = Number.parseFloat(result.lon)

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lon], 15)
      markerRef.current.setLatLng([lat, lon])
    }

    const addressComponents = extractAddressComponents(result)
    onAddressSelect({
      ...addressComponents,
      latitude: lat,
      longitude: lon,
    })

    setSearchResults([])
    setSearchQuery("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address-search">Search Address</Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="address-search"
              placeholder="Enter address to search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button type="button" onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} size="default">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 border rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0 flex items-start space-x-2"
                onClick={() => handleSelectSearchResult(result)}
              >
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{result.display_name}</p>
                  <p className="text-xs text-gray-500">
                    {result.type} • {result.importance?.toFixed(2)} relevance
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label>Select Location on Map</Label>
        <div className="relative">
          <div ref={mapRef} className="w-full h-64 rounded-lg border bg-gray-100" style={{ minHeight: "256px" }} />
          {isLoadingMap && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Click on the map or drag the marker to select your exact location. Use the search above to find addresses
          quickly.
        </p>
      </div>
    </div>
  )
}
