import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Navbar from './components/navbar'
import PropertyOwnerNavbar from './components/property_owner_navbar'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { store } from './redux/store'
import { captureDeviceLocationOnLaunch } from './lib/deviceLocation'
import { authApi } from './repository/auth_repository'
import { updateAccount, selectCurrentAccount } from './redux/slices/accountSlice'
import { getToken } from './lib/localStorage'
import HomeView from './views/home_view'
import InitializationView from './views/initialization_view'
import { Toaster } from 'react-hot-toast'
import LoginView from './views/auth/login_view'
import HelpView from './views/help_view'
import RegisterView from './views/auth/register_view'
import OtpView from './views/auth/otp_view'
import ChangePasswordView from './views/auth/change_password_view'
import ForgotPasswordView from './views/auth/forgot_password_view'
import ResetPasswordView from './views/auth/reset_password_view'
import ForgotPasswordOtpView from './views/auth/forgot_password_otp_view'
import ResetPasswordSuccessView from './views/auth/reset_password_success_view'
import ExploreView from './views/explore_view'
import StatePropertiesView from './views/state_properties_view'
import PropertyDetailsView from './views/property_details_view'
import MyPropertyDetailsView from './views/my_property_details_view'
import PropertyOwnerMyPropertyDetailsView from './views/property_owner_my_property_details_view'
import ReviewsView from './views/reviews_view'
import AllPropertyReviewsView from './views/all_property_reviews_view'
import PropertyOwnerReviewsView from './views/property_owner_reviews_view'
import MyPropertiesView from './views/properties_view'
import FavoritesView from './views/favorites_view'
import RatePropertyView from './views/rate_property_view'
import PropertyOwnerRatePropertyView from './views/property_owner_rate_property_view'
import ScheduleInspectionView from './views/schedule_inspection_view'
import PropertySchedulesView from './views/property_schedules_view'
import PropertyScheduleDetailsView from './views/property_schedule_details_view'
import PaymentView from './views/payment_view'
import ProfileView from './views/profile_view'
import BuyView from './views/buy_view'
import RentView from './views/rent_view'
import ShortletView from './views/shortlet_view'
import LandlordDetailsView from './views/landlord_details_view'
import PropertyOwnerView from './views/property_owner_view'
import PropertyOwnerMyPropertiesView from './views/property_owner_my_properties_view'
import RequestsView from './views/requests_view'
import MyRequestsView from './views/my_requests_view'
import RequestDetailsView from './views/request_details_view'
import KycView from './views/kyc_view'
import KycSelectIdView from './views/kyc_select_id_view'
import KycEnterIdView from './views/kyc_enter_id_view'
import KycVerificationView from './views/kyc_verification_view'
import KycRejectedView from './views/kyc_rejected_view'
import KycSessionExpiredView from './views/kyc_session_expired_view'
import KycSubmitSuccessView from './views/kyc_submit_success_view'
import AddPropertyView from './views/add_property_view'
import EditListingView from './views/edit_listing_view'
import AddPropertyBasicInfoFormView from './views/add_property_basic_info_form_view'
import AddPropertyFeaturesFormView from './views/add_property_features_form_view'
import AddPropertyPriceFormView from './views/add_property_price_form_view'
import AddPropertyHouseRegulationsFormView from './views/add_property_house_regulations_form_view'
import AddPropertyBedroomsView from './views/add_property_bedrooms_view'
import AddPropertyImagesView from './views/add_property_images_view'
import AddPropertySummaryInfoView from './views/add_property_summary_info_view'
import AddPropertyAgreementAndPolicyView from './views/add_property_agreement_and_policy_view'
import AddForSaleAgreementAndPolicyView from './views/add_for_sale_agreement_and_policy_view'
import AddPropertySuccessView from './views/add_property_success_view'
import AddShortletView from './views/add_shortlet_view'
import AddShortletBasicInfoFormView from './views/add_shortlet_basic_info_form_view'
import AddShortletFeaturesView from './views/add_shortlet_features_view'
import AddShortletPriceView from './views/add_shortlet_price_view'
import AddShortletHouseRegulationsView from './views/add_shortlet_house_regulations_view'
import AddShortletBedroomsView from './views/add_shortlet_bedrooms_view'
import AddShortletImagesView from './views/add_shortlet_images_view'
import AddShortletSummaryInfoView from './views/add_shortlet_summary_info_view'
import AddForSaleView from './views/add_for_sale_view'
import AddForSaleBasicInfoFormView from './views/add_for_sale_basic_info_form_view'
import AddForSaleFeaturesView from './views/add_for_sale_features_view'
import AddForSalePriceView from './views/add_for_sale_price_view'
import AddForSaleDocumentsView from './views/add_for_sale_documents_view'
import AddForSaleBedroomsView from './views/add_for_sale_bedrooms_view'
import AddForSaleImagesView from './views/add_for_sale_images_view'
import AddForSaleSummaryInfoView from './views/add_for_sale_summary_info_view'
import MessagesView from './views/messages_view'
import PropertyOwnerMessagesView from './views/property_owner_messages_view'
import NotificationDetailsView from './views/notification_details_view'
import CreatePasswordView from './views/auth/create_password_view'
import UpdateNameView from './views/auth/update_name_view'
import SetAvatarView from './views/auth/set_avatar_view'
import TermsAndConditionsView from './views/terms_and_conditions_view'
import PrivacyPolicyView from './views/privacy_policy_view'
import CookiesPolicyView from './views/cookies_policy_view'
import RefundPolicyView from './views/refund_policy_view'
import CustomerSatisfactionView from './views/customer_satisfaction_view'
import AboutUsView from './views/about_us_view'
import TeamsView from './views/teams_view'
import CareerView from './views/career_view'
import OurAgentsView from './views/our_agents_view'
import ContactUsView from './views/contact_us_view'
import NotFoundView from './views/not_found_view'

const AUTH_PATHS = ['/', '/sign-up', '/login', '/register', '/otp', '/create-password', '/update-name', '/set-avatar', '/change-password', '/forgot-password', '/reset-password', '/forgot-password-otp', '/reset-password-success']

const App = () => {
  const { pathname } = useLocation()
  const account = useSelector(selectCurrentAccount)
  const isAuthRoute = AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))
  const usePropertyOwnerNavbar = account?.landlord_dashboard === true

  useEffect(() => {
    captureDeviceLocationOnLaunch(store.dispatch)
  }, [])

  useEffect(() => {
    if (!getToken()) return
    store.dispatch(authApi.endpoints.getProfile.initiate()).then((res) => {
      if (res.error) return
      const data = res.data
      const user = data?.data?.user ?? data?.user
      if (user) {
        store.dispatch(updateAccount(user))
      }
    })
  }, [])

  return (
    <>
      {!isAuthRoute && (usePropertyOwnerNavbar ? <PropertyOwnerNavbar /> : <Navbar />)}
      <Routes>
        <Route path="/" element={<InitializationView />} />
        <Route path="/sign-up" element={<RegisterView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/help" element={<HelpView />} />
        <Route path="/contact" element={<ContactUsView />} />
        <Route path="/otp/:email" element={<OtpView />} />
        <Route path="/create-password" element={<CreatePasswordView />} />
        <Route path="/update-name" element={<UpdateNameView />} />
        <Route path="/set-avatar" element={<SetAvatarView />} />
        <Route path="/change-password" element={<ChangePasswordView />} />
        <Route path="/forgot-password" element={<ForgotPasswordView />} />
        <Route path="/reset-password" element={<ResetPasswordView />} />
        <Route path="/forgot-password-otp/:email" element={<ForgotPasswordOtpView />} />
        <Route path="/reset-password-success" element={<ResetPasswordSuccessView />} />
        <Route path="/explore" element={<ExploreView />} />
        <Route path="/explore/state/:state" element={<StatePropertiesView />} />
        <Route path="/kyc" element={<KycView />} />
        <Route path="/kyc/select-id" element={<KycSelectIdView />} />
        <Route path="/kyc/enter-id" element={<KycEnterIdView />} />
        <Route path="/kyc/verify" element={<KycVerificationView />} />
        <Route path="/kyc/rejected" element={<KycRejectedView />} />
        <Route path="/kyc/session-expired" element={<KycSessionExpiredView />} />
        <Route path="/kyc/success" element={<KycSubmitSuccessView />} />
        <Route path="/buy" element={<BuyView />} />
        <Route path="/rent" element={<RentView />} />
        <Route path="/shortlet" element={<ShortletView />} />
        <Route path="/messages" element={<MessagesView />} />
        <Route path="/requests" element={<MyRequestsView />} />
        <Route path="/property-details/:id" element={<PropertyDetailsView />} />
        <Route path="/my-property-details/:id" element={<MyPropertyDetailsView />} />
        <Route path="/property-owner/my-property-details/:id" element={<PropertyOwnerMyPropertyDetailsView />} />
        <Route path="/reviews" element={<ReviewsView />} />
        <Route path="/all-reviews" element={<AllPropertyReviewsView />} />
        <Route path="/my-properties" element={<Navigate to="/properties" replace />} />
        <Route path="/listing" element={<Navigate to="/properties" replace />} />
        <Route path="/listings" element={<Navigate to="/properties" replace />} />
        <Route
          path="/properties"
          element={
            account?.landlord_dashboard ? (
              <Navigate to="/property-owner/my-properties" replace />
            ) : (
              <MyPropertiesView />
            )
          }
        />
        <Route path="/property-owner" element={<PropertyOwnerView />} />
        <Route path="/property-owner/my-properties" element={<PropertyOwnerMyPropertiesView />} />
        <Route path="/property-owner/message" element={<PropertyOwnerMessagesView />} />
        <Route path="/property-owner/reviews" element={<PropertyOwnerReviewsView />} />
        <Route path="/property-owner/requests" element={<RequestsView />} />
        <Route path="/property-owner/requests/:id" element={<RequestDetailsView />} />
        <Route path="/notification/:id" element={<NotificationDetailsView />} />
        <Route path="/property-owner/listings" element={<AddPropertyView />} />
        <Route path="/property-owner/listings/edit/:id" element={<EditListingView />} />
        <Route path="/property-owner/add-property/basic-info" element={<AddPropertyBasicInfoFormView />} />
        <Route path="/property-owner/add-property/features" element={<AddPropertyFeaturesFormView />} />
        <Route path="/property-owner/add-property/price" element={<AddPropertyPriceFormView />} />
        <Route path="/property-owner/add-property/house-regulations" element={<AddPropertyHouseRegulationsFormView />} />
        <Route path="/property-owner/add-property/bedrooms" element={<AddPropertyBedroomsView />} />
        <Route path="/property-owner/add-property/images" element={<AddPropertyImagesView />} />
        <Route path="/property-owner/add-property/summary" element={<AddPropertySummaryInfoView />} />
        <Route path="/property-owner/add-property/agreement" element={<AddPropertyAgreementAndPolicyView />} />
        <Route path="/property-owner/add-sale/agreement" element={<AddForSaleAgreementAndPolicyView />} />
        <Route path="/property-owner/add-property/success" element={<AddPropertySuccessView />} />
        <Route path="/property-owner/shortlet" element={<AddShortletView />} />
        <Route path="/property-owner/sale" element={<AddForSaleView />} />
        <Route path="/property-owner/add-sale/basic-info" element={<AddForSaleBasicInfoFormView />} />
        <Route path="/property-owner/add-sale/features" element={<AddForSaleFeaturesView />} />
        <Route path="/property-owner/add-sale/price" element={<AddForSalePriceView />} />
        <Route path="/property-owner/add-sale/documents" element={<AddForSaleDocumentsView />} />
        <Route path="/property-owner/add-sale/bedrooms" element={<AddForSaleBedroomsView />} />
        <Route path="/property-owner/add-sale/images" element={<AddForSaleImagesView />} />
        <Route path="/property-owner/add-sale/summary" element={<AddForSaleSummaryInfoView />} />
        <Route path="/property-owner/add-shortlet/basic-info" element={<AddShortletBasicInfoFormView />} />
        <Route path="/property-owner/add-shortlet/features" element={<AddShortletFeaturesView />} />
        <Route path="/property-owner/add-shortlet/price" element={<AddShortletPriceView />} />
        <Route path="/property-owner/add-shortlet/house-regulations" element={<AddShortletHouseRegulationsView />} />
        <Route path="/property-owner/add-shortlet/bedrooms" element={<AddShortletBedroomsView />} />
        <Route path="/property-owner/add-shortlet/images" element={<AddShortletImagesView />} />
        <Route path="/property-owner/add-shortlet/summary" element={<AddShortletSummaryInfoView />} />
        <Route path="/favourites" element={<FavoritesView />} />
        <Route path="/rate-property/:id?" element={<RatePropertyView />} />
        <Route path="/property_owner/rate-property/:id?" element={<PropertyOwnerRatePropertyView />} />
        <Route path="/schedule-inspection/:id?" element={<ScheduleInspectionView />} />
        <Route path="/property-schedules/:propertyId" element={<PropertySchedulesView />} />
        <Route path="/property-schedules/:propertyId/:scheduleId" element={<PropertyScheduleDetailsView />} />
        <Route path="/payment/:id?" element={<PaymentView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/privacy" element={<PrivacyPolicyView />} />
        <Route path="/cookies" element={<CookiesPolicyView />} />
        <Route path="/refund" element={<RefundPolicyView />} />
        <Route path="/satisfaction" element={<CustomerSatisfactionView />} />
        <Route path="/about" element={<AboutUsView />} />
        <Route path="/teams" element={<TeamsView />} />
        <Route path="/career" element={<CareerView />} />
        <Route path="/agents" element={<OurAgentsView />} />
        <Route path="/terms" element={<TermsAndConditionsView onBack={() => window.history.back()} />} />
        <Route path="/landlord-details" element={<LandlordDetailsView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App