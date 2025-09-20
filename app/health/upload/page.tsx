"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { saveHealthRecord } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { LanguageSelector } from "@/components/language-selector"
import { Heart, Upload, FileText, Camera, Mic, X, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url?: string
  uploading: boolean
  progress: number
}

export default function HealthUploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [documentType, setDocumentType] = useState("")
  const [description, setDescription] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [medications, setMedications] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const documentTypes = [
    { value: "medical-report", label: "Medical Report" },
    { value: "vaccination-certificate", label: "Vaccination Certificate" },
    { value: "blood-test", label: "Blood Test Results" },
    { value: "x-ray", label: "X-Ray/Scan Results" },
    { value: "prescription", label: "Prescription" },
    { value: "health-checkup", label: "Health Checkup Report" },
    { value: "other", label: "Other Medical Document" },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploading: false,
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const uploadFile = async (file: File, fileData: UploadedFile) => {
    try {
      setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, uploading: true, progress: 0 } : f)))

      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileData.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 }
            }
            return f
          }),
        )
      }, 200)

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      clearInterval(progressInterval)

      setFiles((prev) =>
        prev.map((f) => (f.id === fileData.id ? { ...f, uploading: false, progress: 100, url: base64 } : f)),
      )

      return base64
    } catch (error) {
      console.error("Upload error:", error)
      setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, uploading: false, progress: 0 } : f)))
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!documentType) {
      setError("Please select a document type")
      return
    }

    if (files.length === 0) {
      setError("Please upload at least one document")
      return
    }

    try {
      const fileInputElement = fileInputRef.current
      if (!fileInputElement?.files) return

      const uploadPromises = Array.from(fileInputElement.files).map(async (file, index) => {
        const fileData = files[index]
        if (fileData && !fileData.url) {
          return await uploadFile(file, fileData)
        }
        return fileData?.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      const healthRecord = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId: user?.uid || "",
        type: documentType as any,
        title: documentTypes.find((t) => t.value === documentType)?.label || documentType,
        description: description || undefined,
        uploadDate: new Date().toISOString(),
        status: "pending" as const,
        fileUrl: uploadedUrls[0],
        fileName: files[0]?.name,
        additionalData: {
          symptoms,
          medications,
          allFiles: files.map((file, index) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            url: uploadedUrls[index],
          })),
        },
      }

      saveHealthRecord(healthRecord)

      setSuccess("Health documents uploaded successfully! They will be reviewed by the health department.")

      setFiles([])
      setDocumentType("")
      setDescription("")
      setSymptoms("")
      setMedications("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Failed to upload documents")
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      setSymptoms((prev) => prev + " [Voice recording added]")
    }, 3000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // AppLayout already handles auth checks and redirects, no need to duplicate here

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Kerala Health Records
                </h1>
                <p className="text-sm text-gray-600">Upload Health Documents</p>
              </div>
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">Upload Health Documents</h2>
            <p className="text-lg sm:text-xl text-emerald-100 leading-relaxed">
              Securely upload your medical reports, certificates, and health information 
              for government review and digital health record management
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-8">
        <div className="container mx-auto px-4 -mt-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Alert Messages */}
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 shadow-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 shadow-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Document Type Selection */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">Document Information</CardTitle>
                      <CardDescription>Select the type of health document you're uploading</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="documentType" className="text-sm font-semibold text-gray-700">
                      Document Type *
                    </Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger className="h-12 bg-white border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Choose your document type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                        {documentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="py-3 px-4 hover:bg-blue-50">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide additional details about this document (e.g., hospital name, date of test, specific conditions)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="bg-white border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: File Upload */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">Upload Files</CardTitle>
                      <CardDescription>
                        Upload photos or PDFs of your health documents. Supported formats: JPG, PNG, PDF (Max 10MB each)
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Enhanced Upload Zone */}
                    <div
                      className="relative border-3 border-dashed border-gray-300 rounded-2xl p-6 sm:p-12 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-gray-50 to-white"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.add('border-purple-400', 'bg-purple-50')
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50')
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50')
                        const droppedFiles = Array.from(e.dataTransfer.files)
                        const newFiles: UploadedFile[] = droppedFiles.map((file) => ({
                          id: Math.random().toString(36).substr(2, 9),
                          name: file.name,
                          type: file.type,
                          size: file.size,
                          uploading: false,
                          progress: 0,
                        }))
                        setFiles((prev) => [...prev, ...newFiles])
                      }}
                    >
                      <div className="space-y-4">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Drop files here or click to browse</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-4">Drag and drop your medical documents here, or click to select files</p>
                          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 mb-4">
                            <span className="bg-gray-100 px-2 py-1 rounded">JPG</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">PNG</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">PDF</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Max 10MB</span>
                          </div>
                        </div>
                        <Button type="button" variant="outline" className="bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-300">
                          <Camera className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Enhanced File List */}
                    {files.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800">Uploaded Files ({files.length})</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFiles([])}
                            className="text-gray-500 hover:text-red-600"
                          >
                            Clear All
                          </Button>
                        </div>
                        <div className="grid gap-3">
                          {files.map((file) => (
                            <div key={file.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-200 transition-colors shadow-sm">
                              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">{file.name}</p>
                                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                  <span>{formatFileSize(file.size)}</span>
                                  {file.type && (
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                      {file.type.split('/')[1]?.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                {file.uploading && (
                                  <div className="mt-2 space-y-1">
                                    <Progress value={file.progress} className="w-full h-2" />
                                    <p className="text-xs text-blue-600 font-medium">Uploading... {file.progress}%</p>
                                  </div>
                                )}
                                {file.url && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    <p className="text-xs text-green-600 font-medium">Uploaded successfully</p>
                                  </div>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                disabled={file.uploading}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Health Information */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">Health Information</CardTitle>
                      <CardDescription>Provide details about your current health status and symptoms (Optional)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="symptoms" className="text-sm font-semibold text-gray-700">
                      Current Symptoms or Health Concerns
                    </Label>
                    <div className="flex gap-3">
                      <Textarea
                        id="symptoms"
                        placeholder="Describe any symptoms, health concerns, or recent medical issues (e.g., fever, headache, blood pressure readings)..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={4}
                        className="flex-1 bg-white border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors resize-none"
                      />
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={startRecording}
                          disabled={isRecording}
                          className={`bg-white border-2 hover:bg-green-50 transition-colors ${
                            isRecording 
                              ? 'border-red-300 text-red-600 bg-red-50' 
                              : 'border-green-200 hover:border-green-300'
                          }`}
                        >
                          <Mic className={`h-4 w-4 mr-1 ${isRecording ? "text-red-500 animate-pulse" : "text-green-600"}`} />
                          {isRecording ? "Recording..." : "Voice Note"}
                        </Button>
                        <p className="text-xs text-gray-500 text-center">Click to add voice note</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="medications" className="text-sm font-semibold text-gray-700">
                      Current Medications
                    </Label>
                    <Textarea
                      id="medications"
                      placeholder="List any medications you are currently taking, including dosage and frequency (e.g., Aspirin 100mg once daily)..."
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      rows={3}
                      className="bg-white border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Submit Section */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Ready to Submit?</h3>
                  <p className="text-emerald-100">
                    Your documents will be securely processed and reviewed by health officials
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Button
                    type="submit"
                    disabled={files.some((f) => f.uploading) || !documentType || files.length === 0}
                    className="flex-1 h-12 bg-white text-emerald-600 hover:bg-gray-100 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {files.some((f) => f.uploading) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit for Review
                      </>
                    )}
                  </Button>
                  <Link href="/dashboard" className="flex-shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-6 bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-600 transition-colors"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>

                {/* Progress Indicator */}
                <div className="mt-8 flex justify-center items-center gap-2 text-emerald-100 text-sm">
                  <div className={`h-3 w-3 rounded-full ${documentType ? 'bg-white' : 'bg-emerald-400'}`} />
                  <div className={`h-1 w-8 ${files.length > 0 ? 'bg-white' : 'bg-emerald-400'}`} />
                  <div className={`h-3 w-3 rounded-full ${files.length > 0 ? 'bg-white' : 'bg-emerald-400'}`} />
                  <div className={`h-1 w-8 ${(symptoms || medications) ? 'bg-white' : 'bg-emerald-400'}`} />
                  <div className={`h-3 w-3 rounded-full ${(symptoms || medications) ? 'bg-white' : 'bg-emerald-400'}`} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
