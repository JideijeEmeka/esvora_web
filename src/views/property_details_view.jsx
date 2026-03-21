import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import propertyController from '../controllers/property_controller'
import { selectPropertyDetails } from '../redux/slices/propertySlice'
import { normalizePropertyDetails } from '../lib/propertyUtils'
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  MapIcon, 
  Share2, 
  Calendar,
  Star,
  Check,
  Wifi,
  Home,
  Zap,
  Fence,
  Droplets,
  Car,
  CheckCircle,
  Locate,
  Waves,
  Dumbbell
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Divider from '../components/divider'
import LocationWidget from '../components/location_widget'
import PaymentWidget from '../components/payment_widget'
import RegulationsWidget from '../components/regulations_widget'
import ReviewsWidget from '../components/reviews_widget'
import SharePropertyWidget from '../components/share_property_widget'
import AddToFavoriteWidget from '../components/add_to_favorite_widget'
import ScheduleInspectionWidget from '../components/schedule_inspection_widget'
import ScheduleInspectionSubmittedWidget from '../components/schedule_inspection_submitted_widget'
import toast from 'react-hot-toast'
import SendRequestWidget from '../components/send_request_widget'
import RequestSubmittedWidget from '../components/request_submitted_widget'
import LandlordDetailsWidget from '../components/landlord_details_widget'
import Loader from '../components/loader'


const FEATURE_ICONS = {
  WiFi: Wifi,
  'WiFi Available': Wifi,
  Furniture: Home,
  Furnitures: Home,
  'Swimming Pool': Waves,
  Gym: Dumbbell,
  'Parking Space': Car,
  'Parking space': Car,
  'Electricity available': Zap,
  'Fenced with gate': Fence,
  'Water available': Droplets
}

const PropertyDetailsView = ({ onlyRateProperty = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const apiDetails = useSelector(selectPropertyDetails)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isScheduleSubmittedOpen, setIsScheduleSubmittedOpen] = useState(false)
	const [isSendRequestOpen, setIsSendRequestOpen] = useState(false)
	const [isSendRequestSubmitting, setIsSendRequestSubmitting] = useState(false)
	const [isRequestSubmittedOpen, setIsRequestSubmittedOpen] = useState(false)
  const relatedPropertiesRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      setLoadError('Property not found')
      return
    }
    setIsLoading(true)
    setLoadError(null)
    propertyController.getPropertyDetails(id, {
      onSuccess: () => setIsLoading(false),
      onError: (msg) => {
        setLoadError(msg ?? 'Failed to load property')
        setIsLoading(false)
      }
    })
  }, [id])

  const rawProperty = apiDetails && String(apiDetails?.id ?? apiDetails?.uuid) === String(id) ? apiDetails : null
  const normalized = normalizePropertyDetails(rawProperty)
  const property = normalized ? {
    ...normalized,
    raw: rawProperty,
    features: (normalized.features ?? []).map((f) => {
      const name = typeof f === 'string' ? f : (f?.name ?? f?.label ?? '')
      return { name, icon: FEATURE_ICONS[name] ?? Check }
    }),
    relatedProperties: (normalized.relatedProperties ?? []).map((rp) => ({
      id: rp.id ?? rp.uuid,
      image: rp.image ?? rp.images?.[0] ?? '',
      price: rp.price ?? rp.price_formatted ?? '—',
      description: rp.description ?? rp.title ?? '—',
      location: rp.location ?? rp.address ?? '—',
      available: rp.status !== 'inactive'
    }))
  } : null

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'information', label: 'Information' },
    { id: 'features', label: 'Features' },
    { id: 'landlord', label: 'Landlord' },
    { id: 'location', label: 'Location' },
    { id: 'payment', label: 'Payment Info' },
    { id: 'regulations', label: 'Regulations' },
    { id: 'review', label: 'Review' }
  ]

  const scrollCarousel = (ref, direction) => {
    if (!ref.current) return
    const scrollAmount = 300
    if (direction === 'right') {
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    } else {
      ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    return (
      <div className='flex items-center gap-1'>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const PropertyCard = ({ property }) => (
    <div className='shrink-0 w-[280px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
      <div className='relative'>
        <img 
          src={property.image} 
          alt={property.description}
          className='w-full h-[200px] object-cover'
        />
        {property.available && (
          <div className='absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full'>
            <span className='text-[12px] font-medium text-gray-700'>Available</span>
          </div>
        )}
        <button
          className='absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors'
        >
          <Heart className='w-4 h-4 text-gray-700' />
        </button>
      </div>
      <div className='p-4'>
        <p className='text-[20px] font-semibold text-gray-900 mb-2'>{property.price}</p>
        <p className='text-[14px] font-medium text-gray-700 mb-2'>{property.description}</p>
        <div className='flex items-center gap-1'>
          <MapIcon className='w-4 h-4 text-gray-500' />
          <p className='text-[14px] text-gray-500'>{property.location}</p>
        </div>
      </div>
    </div>
  )

  const handleSendRequest = (formData) => {
    const fullName = (formData.fullName ?? '').trim()
    const email = (formData.email ?? '').trim()
    const phone = (formData.phone ?? '').replace(/\s/g, '')
    if (fullName.length < 2) {
      toast.error('Please enter your full name')
      return
    }
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    if (!/^[\w.-]+@[\w.-]+\.\w{2,4}$/i.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!phone || phone.length < 9) {
      toast.error('Please enter a valid phone number')
      return
    }
    const propId = property?.id ?? property?.uuid
    if (!propId) {
      toast.error('Property not found')
      return
    }
    const pt = property?.property_type ?? property?.raw?.property_type
    const pTypeStr = typeof pt === 'string' ? pt : (pt?.name ?? pt?.slug ?? 'rent')
    const pType = (pTypeStr ?? 'rent').toLowerCase()
    const isShortlet = pType === 'shortlet'
    const isSales = pType === 'sales'

    if (!isShortlet) {
      if (!formData.scheduleDate) {
        toast.error('Please select a schedule date')
        return
      }
      const msg = (formData.message ?? '').trim()
      if (msg.length < 10) {
        toast.error('Message must be at least 10 characters')
        return
      }
    }
    if (isShortlet) {
      if (!formData.checkInDate) {
        toast.error('Please select check-in date')
        return
      }
      if (!formData.checkOutDate) {
        toast.error('Please select check-out date')
        return
      }
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.checkOutDate)
      if (checkOut <= checkIn) {
        toast.error('Check-out date must be after check-in date')
        return
      }
    }

    const body = {
      propertyId: String(propId),
      fullname: fullName,
      email,
      phoneNumber: phone.startsWith('+') ? phone : `+234${phone.replace(/^0/, '')}`,
      urgency: formData.urgency || 'not_urgent',
      message: (formData.message ?? '').trim(),
      scheduleDate: formData.scheduleDate ?? ''
    }
    const onSuccess = () => {
      setIsSendRequestOpen(false)
      setIsRequestSubmittedOpen(true)
      propertyController.listMyRequests({ forceRefetch: true })
      propertyController.getAllProperties({ forceRefetch: true })
    }
    const onError = (msg) => toast.error(msg ?? 'Failed to submit request')
    setIsSendRequestSubmitting(true)

    if (isSales) {
      propertyController.submitRequestForSales(body, {
        onSuccess,
        onError: (m) => { setIsSendRequestSubmitting(false); onError(m) }
      }).finally(() => setIsSendRequestSubmitting(false))
    } else if (isShortlet) {
      propertyController.submitRequestForShortlet(
        {
          ...body,
          checkInDate: formData.checkInDate ?? '',
          checkOutDate: formData.checkOutDate ?? '',
          adults: formData.adults ?? 1,
          children: formData.children ?? 0
        },
        {
          onSuccess,
          onError: (m) => { setIsSendRequestSubmitting(false); onError(m) }
        }
      ).finally(() => setIsSendRequestSubmitting(false))
    } else {
      propertyController.submitRequestForRent(body, {
        onSuccess,
        onError: (m) => { setIsSendRequestSubmitting(false); onError(m) }
      }).finally(() => setIsSendRequestSubmitting(false))
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className='pt-20 pb-10 px-6 md:px-16 lg:px-20'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors'
          >
            <ChevronLeft className='w-5 h-5' />
            Back
          </button>
          <div className='flex items-center justify-center min-h-[50vh]'>
            <Loader />
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (loadError || !property) {
    return (
      <>
        <Navbar />
        <div className='pt-20 pb-10 px-6 flex flex-col items-center justify-center min-h-[50vh] gap-4'>
          <p className='text-gray-600'>{loadError ?? 'Property not found'}</p>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='text-primary font-medium hover:underline'
          >
            Go back
          </button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <SharePropertyWidget
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        property={property}
      />
      <AddToFavoriteWidget
        isOpen={isFavoriteOpen}
        onClose={() => setIsFavoriteOpen(false)}
        property={property}
      />
      <ScheduleInspectionWidget
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onScheduleSubmitted={() => setIsScheduleSubmittedOpen(true)}
        property={property}
      />
      <ScheduleInspectionSubmittedWidget
        isOpen={isScheduleSubmittedOpen}
        onClose={() => setIsScheduleSubmittedOpen(false)}
        onCheckStatus={() => setIsScheduleSubmittedOpen(false)}
        property={property}
      />
      <SendRequestWidget
        isOpen={isSendRequestOpen}
        onClose={() => setIsSendRequestOpen(false)}
        property={property}
        onSubmit={handleSendRequest}
        isSubmitting={isSendRequestSubmitting}
      />
      <RequestSubmittedWidget
        isOpen={isRequestSubmittedOpen}
        onClose={() => setIsRequestSubmittedOpen(false)}
      />
      <div className='pt-30 pb-10 px-6 md:px-16 lg:px-20'>
        {/* Back button - always use history to return to where user left off */}
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors'
        >
          <ChevronLeft className='w-5 h-5' />
          Back
        </button>
        {/* Page Header */}
        <div className='py-1'>
          <p className='text-[14px] text-gray-500 mb-2'>Showing property information</p>
          <h1 className='text-[32px] md:text-[40px] font-bold text-gray-900'>
            {property.title}, {property.location}
          </h1>
        </div>

        <div className='flex flex-col md:flex-row gap-6'>
          {/* Left Column - Main Content */}
          <div className='flex-1 md:w-[930px]'>
            {/* Image Gallery */}
            <div className='mb-8'>
              <div className='relative w-[870px] max-md:w-[350px] h-[400px] md:h-[500px] rounded-4xl overflow-hidden mb-4'>
                <img
                  src={property.images[selectedImageIndex]}
                  alt={property.title}
                  className='w-full h-full object-cover'
                />
                {selectedImageIndex < property.images.length - 1 && (
                  <div className='absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-[14px] font-medium'>
                    +{property.images.length - 4} more
                  </div>
                )}
              </div>
              <div className='flex gap-3 overflow-x-auto scrollbar-hide'>
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 w-[120px] h-[100px] rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className='border-b border-gray-200 mb-6'>
              <div className='flex gap-6 overflow-x-auto scrollbar-hide'>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 pb-4 text-[16px] font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className='mb-8'>
              {/* Overview Tab Content */}
              {activeTab === 'overview' && (
                /* Property Summary */
                <>
                <div className='mb-8'>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    {property.property_type && (
                      <span className='inline-block px-3 py-1 bg-primary/10 text-primary text-[14px] font-medium rounded-full mb-3'>
                        {property.property_type}
                      </span>
                    )}
                    <p className='text-[36px] md:text-[48px] font-bold text-gray-900 mb-2'>
                      {property.price}
                    </p>
                    <p className='text-[16px] text-gray-600 mb-4'>{property.fullAddress}</p>
                    <div className='flex flex-wrap items-center gap-4 text-[14px] text-gray-700'>
                      <span className='flex items-center gap-1'>
                        <Home className='w-4 h-4' /> {property.bedrooms} Bed
                      </span>
                      <span className='flex items-center gap-1'>
                        <Droplets className='w-4 h-4' /> {property.bathrooms} Baths
                      </span>
                      <span className='flex items-center gap-1'>
                        <Wifi className='w-4 h-4' /> Wifi Available
                      </span>
                      <span className='flex items-center gap-1'>
                        <Home className='w-4 h-4' /> Furnitures
                      </span>
                      <span className='flex items-center gap-1'>
                        <Zap className='w-4 h-4' /> Electricity
                      </span>
                      <Link to='#' className='text-primary hover:underline'>Show all &gt;</Link>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className='flex flex-col items-start gap-3 mb-6'>
                  <span className='text-[24px] font-bold text-gray-900'>{property.rating}</span>
                  {renderStars(property.rating)}
                  <span className='text-[14px] text-gray-600 px-3 py-1 bg-gray-200 rounded-3xl'>
                    Based on reviews from verified users
                  </span>
                </div>
              </div>
                  {/* About Property */}
                  <div className='mb-8'>
                    <div className='w-full bg-gray-200 h-0.5'></div>
                    <h2 className='text-[24px] font-semibold text-gray-900 mt-6 mb-4'>About property</h2>
                    <p className='text-[16px] text-gray-700 leading-relaxed pb-8'>{property.about}</p>
                    <div className='w-full bg-gray-200 h-0.5'></div>
                  </div>

                  {/* Features */}
                  <div className='mb-8'>
                    <h2 className='text-[24px] font-semibold text-gray-900 mb-4'>Features</h2>
                    <div className='flex flex-col gap-4 mb-8'>
                      {property.features.map((feature, index) => {
                        const Icon = feature.icon ?? Check
                        return (
                          <div key={index} className='flex items-center gap-2'>
                            <Icon className='w-5 h-5 text-gray-700' />
                            <span className='text-[16px] text-gray-700'>{feature.name}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className='w-full bg-gray-200 h-0.5'></div>
                  </div>

                  {/* Landlord */}
                  <div className='mb-8'>
                    <div className='flex items-center gap-2 mb-4'>
                      <h2 className='text-[24px] font-semibold text-gray-900'>Landlord</h2>
                      {property.landlord.verified && (
                        <span className='flex items-center px-2 py-1 bg-green-50 text-green-500 text-[12px] font-medium rounded'>
                            <CheckCircle className='w-3 h-3 mr-1' />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className='flex items-center gap-4 mb-8'>
                      <img
                        src={property.landlord.avatar}
                        alt={property.landlord.name}
                        className='w-12 h-12 rounded-full object-cover'
                      />
                      <div>
                        <p className='text-[18px] font-semibold text-gray-900 underline cursor-pointer'>
                          {property.landlord.name}
                        </p>
                        <p className='text-[12px] text-gray-600 mt-1'>
                            Since {property.landlord.joinDate} • {property.landlord.listedProperties} Listed properties
                        </p>
                      </div>
                    </div>
                    <Divider width='full' />
                    {/* Map */}
                    <div className='mt-8'>
                      <LocationWidget property={property} />
                      <PaymentWidget paymentInfo={property.paymentInfo} />
                      <div className='py-8'>
                        <Divider width='full' />
                      </div>
                      <RegulationsWidget regulations={property.regulations} />
                      <div className='py-8'>
                        <Divider width='full' />
                      </div>
                      <ReviewsWidget
                        rating={property.rating}
                        reviewCount={property.reviewCount}
                        reviews={property.reviews}
                        propertyTitle={property.title ?? property.property_type ?? 'Property'}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Information Tab */}
              {activeTab === 'information' && (
                <div className='mb-8'>
                  {property.property_type && (
                    <div className='mb-6'>
                      <span className='text-[12px] font-medium text-gray-500 uppercase tracking-wide'>Property type</span>
                      <p className='text-[18px] font-semibold text-gray-900 mt-1'>{property.property_type}</p>
                    </div>
                  )}
                  <h2 className='text-[24px] font-semibold text-gray-900 mb-4'>About property</h2>
                  <p className='text-[16px] text-gray-700 leading-relaxed'>
                    {property.about || 'No description available.'}
                  </p>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className='mb-8'>
                  <h2 className='text-[24px] font-semibold text-gray-900 mb-4'>Features</h2>
                  <div className='flex flex-col gap-4'>
                    {property.features.map((feature, index) => {
                      const Icon = feature.icon ?? Check
                      return (
                        <div key={index} className='flex items-center gap-3'>
                          <Icon className='w-5 h-5 text-gray-700 shrink-0' />
                          <span className='text-[16px] text-gray-700'>{feature.name}</span>
                        </div>
                      )
                    })}
                    {property.features.length === 0 && (
                      <p className='text-[14px] text-gray-500'>No features listed.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Landlord Details Tab */}
              {activeTab === 'landlord' && (
                <>
                <LandlordDetailsWidget landlord={property.landlord} />     
                </>
              )}

              {/* Location Tab */}
              {activeTab === 'location' && (
                <LocationWidget property={property} />
              )}

              {/* Payment Info Tab */}
              {activeTab === 'payment' && (
                <PaymentWidget paymentInfo={property.paymentInfo} />
              )}

              {/* Regulations Tab */}
              {activeTab === 'regulations' && (
                <RegulationsWidget regulations={property.regulations} />
              )}

              {/* Reviews Tab */}
              {activeTab === 'review' && (
                <ReviewsWidget
                  rating={property.rating}
                  reviewCount={property.reviewCount}
                  reviews={property.reviews}
                  propertyTitle={property.title ?? property.property_type ?? 'Property'}
                />
              )}
            </div>

            {/* Other Related Properties */}
            {activeTab !== 'landlord' && (
            <div className='mb-8'>
              <div className='flex items-center justify-between gap-2 mb-6 mt-12'>
                  <h2 className='text-[24px] font-semibold text-gray-900'>Other related properties</h2>
                  <div className='flex items-center gap-2'>
                    <button
                    onClick={() => scrollCarousel(relatedPropertiesRef, 'left')}
                    className='w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'
                    >
                    <ChevronLeft className='w-5 h-5 text-gray-700' />
                    </button>
                    <button
                    onClick={() => scrollCarousel(relatedPropertiesRef, 'right')}
                    className='w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'
                    >
                    <ChevronRight className='w-5 h-5 text-gray-700' />
                    </button>
                  </div>
              </div>
              <div className='relative'>
                <div
                  ref={relatedPropertiesRef}
                  className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
                >
                  {property.relatedProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className='w-full'>
            {/* Action Icons - Share, Schedule, Favorite */}
              <div className='flex items-center justify-between gap-2 mb-6'>
                <button
                    onClick={() => setIsShareOpen(true)}
                    className='w-30 h-12 rounded-full border border-gray-300 bg-gray-50
                      flex items-center justify-center hover:scale-105 hover:bg-primary/10 transition-colors'
                    title='Share'
                    >
                    <Share2 className='w-4 h-4 text-gray-700' />
                    <span className='text-[14px] font-medium text-gray-700 ml-2'>Share</span>
                    </button>
                    <button
                    className='w-30 h-12 rounded-full border border-gray-300 bg-gray-50
                      flex items-center justify-center hover:scale-105 hover:bg-primary/10 transition-colors'
                    title='Calendar'
                    onClick={() => setIsScheduleOpen(true)}
                    >
                    <Calendar className='w-4 h-4 text-gray-700' />
                    <span className='text-[14px] font-medium text-gray-700 ml-2'>Schedule</span>
                    </button>
                    <button
                  onClick={() => setIsFavoriteOpen(true)}
                  className={`w-30 h-12 rounded-full border border-gray-300 bg-gray-50
                    flex items-center justify-center hover:scale-105 hover:bg-primary/10 transition-colors ${
                    isFavorite
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-primary/10'
                  }`}
                  title='Favorite'
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? 'fill-primary text-primary' : 'text-gray-700'
                    }`}
                  />
                  <span className='text-[14px] font-medium text-gray-700 ml-2'>Favorite</span>
                </button>
              </div>
            <div className='bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm'>

              {/* Location Box */}
              <div className='mb-6 pb-6 border-b border-gray-200'>
                <div className='flex items-center justify-start mb-2'>
                    <Locate className='w-4 h-4 text-gray-700' />
                    <div className='flex flex-col items-start ml-2'>
                        <h3 className='text-[18px] font-semibold text-gray-900'>Location</h3>
                        <p className='text-[14px] text-gray-500 mb-4'>Based on custom preference</p>
                    </div>
                </div>
                <div className='space-y-2 text-[14px]'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Country:</span>
                    <span className='text-gray-900 font-medium'>Nigeria</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>City:</span>
                    <span className='text-gray-900 font-medium'>Lagos</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>State:</span>
                    <span className='text-gray-900 font-medium'>Lagos</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Related property:</span>
                    <span className='text-gray-900 font-medium'>25</span>
                  </div>
                </div>
              </div>

              {/* Landlord Information */}
              <div className='mb-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <h3 className='text-[18px] font-semibold text-gray-900'>Landlord</h3>
                  {property.landlord.verified && (
                    <span className='px-2 py-1 bg-green-100 text-green-700 text-[12px] font-medium rounded'>
                      Verified
                    </span>
                  )}
                </div>
                <div className='flex items-center gap-3 mb-4'>
                  <img
                    src={property.landlord.avatar}
                    alt={property.landlord.name}
                    className='w-10 h-10 rounded-full object-cover'
                  />
                  <div>
                    <p className='text-[16px] font-semibold text-gray-900'>
                      {property.landlord.name}
                    </p>
                    <p className='text-[12px] text-gray-500'>
                      Since {property.landlord.joinDate} • {property.landlord.listedProperties} Listed properties
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className='space-y-3'>
                {onlyRateProperty ? (
                  <button
                    type='button'
                    onClick={() => {
                      window.scrollTo(0, 0)
                      navigate(`/rate-property/${id}`)
                    }}
                    className='w-full bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium text-[16px]'
                  >
                    Rate property
                  </button>
                ) : (() => {
                  const requestStatus = (location.state?.requestStatus ?? '').toLowerCase()
                  const isApproved = requestStatus === 'accepted' || requestStatus === 'approved' || requestStatus === 'rented'
                  const isPending = requestStatus === 'pending'
                  if (isApproved) {
                    const paymentState = {
                      property: property ? {
                        id: property.id,
                        uuid: property.uuid,
                        images: property.images,
                        image: property.image,
                        price: property.price,
                        paymentInfo: property.paymentInfo,
                        priceNGN: property.priceNGN,
                        totalPrice: property.paymentInfo?.total ?? property.priceNGN,
                        description: property.description,
                        title: property.title,
                        location: property.location,
                        fullAddress: property.fullAddress,
                        address: property.address,
                        property_type: property.property_type
                      } : null,
                      requestId: location.state?.requestId,
                      amount: location.state?.requestAmount ?? property?.paymentInfo?.total
                    }
                    return (
                      <div className='flex flex-col md:flex-row gap-3'>
                        <button
                          type='button'
                          onClick={() => {
                            window.scrollTo(0, 0)
                            navigate(`/rate-property/${id}`)
                          }}
                          className='flex-1 border-2 border-gray-300 text-gray-700 rounded-full px-6 py-3 hover:bg-gray-50 transition-colors font-medium text-[16px]'
                        >
                          Rate property
                        </button>
                        <button
                          type='button'
                          onClick={() => navigate(`/payment/${id}`, { state: paymentState })}
                          className='flex-1 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium text-[16px]'
                        >
                          Make payment
                        </button>
                      </div>
                    )
                  }
                  const contactOwnerButton = (
                    <button
                      key='contact'
                      type='button'
                      onClick={() => {
                          window.scrollTo(0, 0)
                          navigate('/landlord-details', {
                            state: {
                              landlord: {
                                ...property.landlord,
                                dateJoined: property.landlord.joinDate || 'Nov 2025',
                                listingsCount: property.landlord.listedProperties || 24,
                                rating: 4.6,
                                propertyTypes: 'Apartments, Duplexes, Studios, Lodges, etc.',
                                responseTime: 'Responds within 2 hours',
                                paymentPolicies: 'Refundable',
                                paymentOptions: 'Cash - Bank transfer'
                              },
                              from: location.pathname
                            }
                          })
                        }}
                      className='w-full border-2 border-gray-300 text-gray-700 rounded-full px-6 py-3 hover:bg-primary/5 transition-colors font-medium text-[16px]'
                    >
                      Contact owner
                    </button>
                  )
                  if (isPending) {
                    return contactOwnerButton
                  }
                  return (
                    <>
                      <button
                        type='button'
                        onClick={() => setIsSendRequestOpen(true)}
                        className='w-full bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium text-[16px]'
                      >
                        Send request
                      </button>
                      {contactOwnerButton}
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PropertyDetailsView
