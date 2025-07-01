"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  CreditCard,
  Download,
  DollarSign,
  Calendar,
  Receipt,
  Plus,
  Edit,
  Trash2,
  Star,
  MapPin,
  CheckCircle,
  Home,
  Building,
} from "lucide-react"
import Link from "next/link"
import LeafletAddressSelector from "@/components/leaflet-address-selector"

interface PaymentMethod {
  id: number
  cardholder_name: string
  card_number: string
  card_expiry: string
  is_primary: boolean
  status: string
  billing_address?: Address
}

interface Transaction {
  id: number
  amount: number
  description: string
  created_at: string
  status: string
  receipt_url?: string
}

interface Address {
  id: number
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

export default function BillingPage() {
  const { toast } = useToast()
  const supabase = createSupabaseClient()

  const [user, setUser] = useState<any>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [maxSteps] = useState(2)

  // Form states
  const [formData, setFormData] = useState({
    cardholder_name: "",
    card_number: "",
    card_expiry: "",
    card_cvc: "",
    billing_address_id: "",
    is_primary: false,
  })

  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "United States",
    latitude: null as number | null,
    longitude: null as number | null,
    formatted_address: "",
    place_id: "",
    type: "billing",
    is_primary: false,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        window.location.href = "/auth"
        return
      }

      setUser(session.user)

      // Fetch payment methods with billing addresses
      const { data: paymentData } = await supabase
        .from("payment_methods")
        .select(`
          *,
          billing_address:addresses(*)
        `)
        .eq("user_id", session.user.id)
        .eq("is_deleted", false)

      if (paymentData) {
        setPaymentMethods(paymentData)
      }

      // Fetch transactions
      const { data: transactionData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (transactionData) {
        setTransactions(transactionData)
      }

      // Fetch addresses
      const { data: addressData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_deleted", false)
        .order("is_primary", { ascending: false })

      if (addressData) {
        setAddresses(addressData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load billing information",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData((prev) => ({ ...prev, card_number: formatted }))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    setFormData((prev) => ({ ...prev, card_expiry: formatted }))
  }

  const resetPaymentForm = () => {
    setFormData({
      cardholder_name: "",
      card_number: "",
      card_expiry: "",
      card_cvc: "",
      billing_address_id: "",
      is_primary: false,
    })
    setEditingMethod(null)
    setCurrentStep(1)
  }

  const resetAddressForm = () => {
    setAddressForm({
      label: "",
      street: "",
      street2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "United States",
      latitude: null,
      longitude: null,
      formatted_address: "",
      place_id: "",
      type: "billing",
      is_primary: false,
    })
    setEditingAddress(null)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      const billingAddressId = formData.billing_address_id

      if (editingMethod) {
        // Update existing payment method
        const { error } = await supabase
          .from("payment_methods")
          .update({
            cardholder_name: formData.cardholder_name,
            card_number: formData.card_number.replace(/\s/g, ""),
            card_expiry: formData.card_expiry,
            billing_address_id: billingAddressId ? Number.parseInt(billingAddressId) : null,
            is_primary: formData.is_primary,
          })
          .eq("id", editingMethod.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Payment method updated successfully",
        })
      } else {
        // Create new payment method
        const { error } = await supabase.from("payment_methods").insert({
          user_id: user.id,
          cardholder_name: formData.cardholder_name,
          card_number: formData.card_number.replace(/\s/g, ""),
          card_expiry: formData.card_expiry,
          card_cvc: formData.card_cvc,
          billing_address_id: billingAddressId ? Number.parseInt(billingAddressId) : null,
          is_primary: formData.is_primary,
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Payment method added successfully",
        })
      }

      setIsPaymentDialogOpen(false)
      resetPaymentForm()
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save payment method",
        variant: "destructive",
      })
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from("addresses")
          .update({
            ...addressForm,
            is_verified: addressForm.latitude && addressForm.longitude ? true : false,
          })
          .eq("id", editingAddress.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Address updated successfully",
        })
      } else {
        // Create new address
        const { error } = await supabase.from("addresses").insert({
          user_id: user.id,
          ...addressForm,
          is_verified: addressForm.latitude && addressForm.longitude ? true : false,
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Address added successfully",
        })
      }

      setIsAddressDialogOpen(false)
      resetAddressForm()
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save address",
        variant: "destructive",
      })
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressForm({
      label: address.label || "",
      street: address.street,
      street2: address.street2 || "",
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
      latitude: address.latitude,
      longitude: address.longitude,
      formatted_address: address.formatted_address || "",
      place_id: "",
      type: address.type,
      is_primary: address.is_primary,
    })
    setIsAddressDialogOpen(true)
  }

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    try {
      const { error } = await supabase.from("addresses").update({ is_deleted: true }).eq("id", addressId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Address deleted successfully",
      })
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete address",
        variant: "destructive",
      })
    }
  }

  const handleMapAddressSelect = (addressData: any) => {
    setAddressForm((prev) => ({
      ...prev,
      ...addressData,
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalSpent = transactions.reduce((sum, t) => sum + (Number.parseFloat(t.amount.toString()) || 0), 0)

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method)
    setFormData({
      cardholder_name: method.cardholder_name,
      card_number: method.card_number,
      card_expiry: method.card_expiry,
      card_cvc: "",
      billing_address_id: method.billing_address?.id?.toString() || "",
      is_primary: method.is_primary,
    })
    setIsPaymentDialogOpen(true)
  }

  const handleDelete = async (methodId: number) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return

    try {
      const { error } = await supabase.from("payment_methods").update({ is_deleted: true }).eq("id", methodId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      })
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment method",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/user/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
          <p className="text-gray-600">Manage your payment methods, addresses, and view transaction history</p>
        </div>

        <Tabs defaultValue="payment-methods" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="payment-methods" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Methods */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Methods
                      </CardTitle>
                      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              resetPaymentForm()
                              setIsPaymentDialogOpen(true)
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Payment Method
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                              <span>{editingMethod ? "Edit Payment Method" : "Add Payment Method"}</span>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>
                                  Step {currentStep} of {maxSteps}
                                </span>
                              </div>
                            </DialogTitle>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / maxSteps) * 100}%` }}
                              ></div>
                            </div>
                          </DialogHeader>

                          <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            {/* Step 1: Card Details */}
                            {currentStep === 1 && (
                              <div className="space-y-4">
                                <div className="text-center mb-6">
                                  <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                                  <h3 className="text-lg font-semibold">Card Information</h3>
                                  <p className="text-gray-600">Enter your payment card details</p>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="cardholder_name">Cardholder Name *</Label>
                                    <Input
                                      id="cardholder_name"
                                      name="cardholder_name"
                                      value={formData.cardholder_name}
                                      onChange={handleInputChange}
                                      placeholder="John Doe"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="card_number">Card Number *</Label>
                                    <Input
                                      id="card_number"
                                      name="card_number"
                                      value={formData.card_number}
                                      onChange={handleCardNumberChange}
                                      placeholder="1234 5678 9012 3456"
                                      maxLength={19}
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="card_expiry">Expiry Date *</Label>
                                      <Input
                                        id="card_expiry"
                                        name="card_expiry"
                                        value={formData.card_expiry}
                                        onChange={handleExpiryChange}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        required
                                      />
                                    </div>
                                    {!editingMethod && (
                                      <div>
                                        <Label htmlFor="card_cvc">CVC *</Label>
                                        <Input
                                          id="card_cvc"
                                          name="card_cvc"
                                          value={formData.card_cvc}
                                          onChange={handleInputChange}
                                          placeholder="123"
                                          maxLength={4}
                                          required
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                                    <input
                                      type="checkbox"
                                      id="is_primary"
                                      name="is_primary"
                                      checked={formData.is_primary}
                                      onChange={handleInputChange}
                                      className="rounded"
                                    />
                                    <Label htmlFor="is_primary" className="text-sm">
                                      Set as primary payment method
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Step 2: Billing Address */}
                            {currentStep === 2 && (
                              <div className="space-y-4">
                                <div className="text-center mb-6">
                                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                                  <h3 className="text-lg font-semibold">Billing Address</h3>
                                  <p className="text-gray-600">Select or add a billing address</p>
                                </div>

                                <div>
                                  <Label>Select Address</Label>
                                  <Select
                                    value={formData.billing_address_id}
                                    onValueChange={(value) => {
                                      setFormData((prev) => ({ ...prev, billing_address_id: value }))
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose from saved addresses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {addresses.map((address) => (
                                        <SelectItem key={address.id} value={address.id.toString()}>
                                          <div className="flex items-center space-x-2">
                                            {address.is_verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                                            <span>
                                              {address.label && `${address.label} - `}
                                              {address.street}, {address.city}, {address.state} {address.zip_code}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Don't see your address? Add it in the Addresses tab first.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t">
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setIsPaymentDialogOpen(false)
                                    setCurrentStep(1)
                                    resetPaymentForm()
                                  }}
                                >
                                  Cancel
                                </Button>
                                {currentStep > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStep((prev) => prev - 1)}
                                  >
                                    Back
                                  </Button>
                                )}
                              </div>

                              <div>
                                {currentStep < maxSteps ? (
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      // Validate current step before proceeding
                                      if (currentStep === 1) {
                                        if (
                                          !formData.cardholder_name ||
                                          !formData.card_number ||
                                          !formData.card_expiry ||
                                          (!editingMethod && !formData.card_cvc)
                                        ) {
                                          toast({
                                            title: "Validation Error",
                                            description: "Please fill in all required card details",
                                            variant: "destructive",
                                          })
                                          return
                                        }
                                      }
                                      setCurrentStep((prev) => prev + 1)
                                    }}
                                  >
                                    Next: Billing Address
                                  </Button>
                                ) : (
                                  <Button type="submit">
                                    {editingMethod ? "Update Payment Method" : "Add Payment Method"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {paymentMethods.length > 0 ? (
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-gray-900">{method.cardholder_name}</h3>
                                  {method.is_primary && (
                                    <Badge className="bg-blue-100 text-blue-800">
                                      <Star className="w-3 h-3 mr-1" />
                                      Primary
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  **** **** **** {method.card_number.slice(-4)} • Expires {method.card_expiry}
                                </p>
                                {method.billing_address && (
                                  <p className="text-xs text-gray-500 flex items-center mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {method.billing_address.city}, {method.billing_address.state}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(method)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(method.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No payment methods</h3>
                        <p className="text-gray-600 mb-4">Add a payment method to make purchases</p>
                        <Button onClick={() => setIsPaymentDialogOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Payment Method
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Billing Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Spent</span>
                        <span className="font-semibold">${totalSpent.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transactions</span>
                        <span className="font-semibold">{transactions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Methods</span>
                        <span className="font-semibold">{paymentMethods.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Addresses</span>
                        <span className="font-semibold">{addresses.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        resetPaymentForm()
                        setIsPaymentDialogOpen(true)
                      }}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        resetAddressForm()
                        setIsAddressDialogOpen(true)
                      }}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoices
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/pricing">
                        <DollarSign className="w-4 h-4 mr-2" />
                        View Plans
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Saved Addresses
                  </CardTitle>
                  <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          resetAddressForm()
                          setIsAddressDialogOpen(true)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                      </DialogHeader>

                      <form onSubmit={handleAddressSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Column - Form */}
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="label">Address Label</Label>
                              <Input
                                id="label"
                                name="label"
                                value={addressForm.label}
                                onChange={handleAddressChange}
                                placeholder="Home, Office, etc."
                              />
                            </div>

                            <div>
                              <Label htmlFor="street">Street Address *</Label>
                              <Input
                                id="street"
                                name="street"
                                value={addressForm.street}
                                onChange={handleAddressChange}
                                placeholder="123 Main Street"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="street2">Apartment, Suite, etc.</Label>
                              <Input
                                id="street2"
                                name="street2"
                                value={addressForm.street2}
                                onChange={handleAddressChange}
                                placeholder="Apt 4B"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="city">City *</Label>
                                <Input
                                  id="city"
                                  name="city"
                                  value={addressForm.city}
                                  onChange={handleAddressChange}
                                  placeholder="New York"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="state">State *</Label>
                                <Input
                                  id="state"
                                  name="state"
                                  value={addressForm.state}
                                  onChange={handleAddressChange}
                                  placeholder="NY"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="zip_code">ZIP Code *</Label>
                                <Input
                                  id="zip_code"
                                  name="zip_code"
                                  value={addressForm.zip_code}
                                  onChange={handleAddressChange}
                                  placeholder="10001"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="country">Country *</Label>
                                <Input
                                  id="country"
                                  name="country"
                                  value={addressForm.country}
                                  onChange={handleAddressChange}
                                  placeholder="United States"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="type">Address Type</Label>
                              <Select
                                value={addressForm.type}
                                onValueChange={(value) => setAddressForm((prev) => ({ ...prev, type: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="billing">Billing</SelectItem>
                                  <SelectItem value="shipping">Shipping</SelectItem>
                                  <SelectItem value="primary">Primary</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="is_primary_address"
                                name="is_primary"
                                checked={addressForm.is_primary}
                                onChange={handleAddressChange}
                                className="rounded"
                              />
                              <Label htmlFor="is_primary_address" className="text-sm">
                                Set as primary address
                              </Label>
                            </div>
                          </div>

                          {/* Right Column - Map */}
                          <div className="space-y-4">
                            <LeafletAddressSelector
                              onAddressSelect={handleMapAddressSelect}
                              initialAddress={editingAddress}
                            />

                            {addressForm.latitude && addressForm.longitude && (
                              <div className="p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center space-x-2 text-green-800">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">Address Verified</span>
                                </div>
                                <p className="text-xs text-green-600 mt-1">
                                  Location: {addressForm.latitude.toFixed(6)}, {addressForm.longitude.toFixed(6)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-6 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsAddressDialogOpen(false)
                              resetAddressForm()
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">{editingAddress ? "Update Address" : "Add Address"}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              {address.type === "primary" ? (
                                <Home className="w-4 h-4" />
                              ) : (
                                <Building className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold flex items-center space-x-2">
                                <span>
                                  {address.label ||
                                    `${address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address`}
                                </span>
                                {address.is_primary && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">Primary</Badge>
                                )}
                                {address.is_verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                              </h4>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => handleEditAddress(address)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{address.street}</p>
                          {address.street2 && <p>{address.street2}</p>}
                          <p>
                            {address.city}, {address.state} {address.zip_code}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-600 mb-4">Add an address to use for billing and shipping</p>
                    <Button onClick={() => setIsAddressDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center space-x-3">
                          <div>
                            <p className="font-semibold text-lg">${transaction.amount}</p>
                            <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </div>
                          {transaction.receipt_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={transaction.receipt_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-600">Your payment history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
