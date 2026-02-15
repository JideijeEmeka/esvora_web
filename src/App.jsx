import React from 'react'
import Navbar from './components/navbar'
import { Routes, Route } from 'react-router-dom'
import HomeView from './views/home_view'
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
import PropertyDetailsView from './views/property_details_view'
import ReviewsView from './views/reviews_view'
import MyPropertiesView from './views/my_properties_view'
import FavoritesView from './views/favorites_view'
import RatePropertyView from './views/rate_property_view'
import ScheduleInspectionView from './views/schedule_inspection_view'
import PaymentView from './views/payment_view'
import ProfileView from './views/profile_view'
import BuyView from './views/buy_view'
import RentView from './views/rent_view'
import ShortletView from './views/shortlet_view'
import LandlordDetailsView from './views/landlord_details_view'
import PropertyOwnerView from './views/property_owner_view'
import RequestsView from './views/requests_view'
import RequestDetailsView from './views/request_details_view'
import KycView from './views/kyc_view'
import KycFormView from './views/kyc_form_view'
import KycSelectIdView from './views/kyc_select_id_view'
import KycQrcodeView from './views/kyc_qrcode_view'
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

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/help" element={<HelpView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/otp/:email" element={<OtpView />} />
        <Route path="/change-password" element={<ChangePasswordView />} />
        <Route path="/forgot-password" element={<ForgotPasswordView />} />
        <Route path="/reset-password" element={<ResetPasswordView />} />
        <Route path="/forgot-password-otp/:email" element={<ForgotPasswordOtpView />} />
        <Route path="/reset-password-success" element={<ResetPasswordSuccessView />} />
        <Route path="/property-owne" element={<ExploreView />} />
        <Route path="/kyc" element={<KycView />} />
        <Route path="/kyc/form" element={<KycFormView />} />
        <Route path="/kyc/select-id" element={<KycSelectIdView />} />
        <Route path="/kyc/qrcode" element={<KycQrcodeView />} />
        <Route path="/kyc/success" element={<KycSubmitSuccessView />} />
        <Route path="/buy" element={<BuyView />} />
        <Route path="/rent" element={<RentView />} />
        <Route path="/shortlet" element={<ShortletView />} />
        <Route path="/property-details/:id" element={<PropertyDetailsView />} />
        <Route path="/reviews" element={<ReviewsView />} />
        <Route path="/my-properties" element={<MyPropertiesView />} />
        <Route path="/" element={<PropertyOwnerView />} />
        <Route path="/property-owner/requests" element={<RequestsView />} />
        <Route path="/property-owner/requests/:id" element={<RequestDetailsView />} />
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
        <Route path="/schedule-inspection/:id?" element={<ScheduleInspectionView />} />
        <Route path="/payment/:id?" element={<PaymentView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/landlord-details" element={<LandlordDetailsView />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App