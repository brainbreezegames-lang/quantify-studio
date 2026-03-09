import React from 'react'
import SectionHeader from '../shared/SectionHeader'
import SubSection from '../shared/SubSection'
import SignInScreen from './SignInScreen'
import ReservationListScreen from './ReservationListScreen'
import ReservationDetailScreen from './ReservationDetailScreen'
import ShipReservationScreen from './ShipReservationScreen'
import InventoryScreen from './InventoryScreen'
import SettingsScreen from './SettingsScreen'
import EmptyStateScreen from './EmptyStateScreen'
import SearchScreen from './SearchScreen'
import DashboardScreen from './DashboardScreen'
import EquipmentScannerScreen from './EquipmentScannerScreen'
import DeliveryTrackingScreen from './DeliveryTrackingScreen'
import ReturnInspectionScreen from './ReturnInspectionScreen'
import QuoteBuilderScreen from './QuoteBuilderScreen'
import CrewScheduleScreen from './CrewScheduleScreen'
import NotificationsScreen from './NotificationsScreen'
import ReportScreen from './ReportScreen'
import EquipmentDetailScreen from './EquipmentDetailScreen'
import ConnectionSettingsScreen from './ConnectionSettingsScreen'
import AboutScreen from './AboutScreen'

export default function PatternsOverview() {
  return (
    <section id="patterns" className="ds-section">
      <SectionHeader
        label="Patterns"
        title="Screen Patterns"
        description="Complete screen compositions showing how components work together in Quantify."
      />
      <SubSection title="Authentication" description="Login and onboarding.">
        <div className="ds-pattern-grid">
          <SignInScreen />
        </div>
      </SubSection>
      <SubSection title="Core Screens" description="Lists, details, shipping, and equipment lookup.">
        <div className="ds-pattern-grid">
          <ReservationListScreen />
          <ReservationDetailScreen />
          <ShipReservationScreen />
          <EquipmentDetailScreen />
        </div>
      </SubSection>
      <SubSection title="Field Operations" description="Scanning, inspections, deliveries, and on-site quotes.">
        <div className="ds-pattern-grid">
          <EquipmentScannerScreen />
          <DeliveryTrackingScreen />
          <ReturnInspectionScreen />
          <QuoteBuilderScreen />
        </div>
      </SubSection>
      <SubSection title="Dispatch & Planning" description="Crew scheduling, notifications, and analytics.">
        <div className="ds-pattern-grid">
          <CrewScheduleScreen />
          <NotificationsScreen />
          <ReportScreen />
        </div>
      </SubSection>
      <SubSection title="Utilities" description="Search, inventory, settings, dashboard, and empty states.">
        <div className="ds-pattern-grid">
          <InventoryScreen />
          <SearchScreen />
          <SettingsScreen />
          <DashboardScreen />
          <ConnectionSettingsScreen />
          <AboutScreen />
          <EmptyStateScreen />
        </div>
      </SubSection>
    </section>
  )
}
