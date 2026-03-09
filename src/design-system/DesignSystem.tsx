import { useState, useCallback } from 'react'
import './design-system.css'

// Layout
import TopBar from './layout/TopBar'
import Sidebar from './layout/Sidebar'
import ContentArea from './layout/ContentArea'

// Foundations
import BrandSection from './foundations/BrandSection'
import ConventionsSection from './foundations/ConventionsSection'
import ColorSection from './foundations/ColorSection'
import TypographySection from './foundations/TypographySection'
import ElevationSection from './foundations/ElevationSection'
import ShapeSection from './foundations/ShapeSection'
import SpacingSection from './foundations/SpacingSection'
import StatesSection from './foundations/StatesSection'
import MotionSection from './foundations/MotionSection'

// Components — Actions
import ButtonsSection from './components/ButtonsSection'
import IconButtonsSection from './components/IconButtonsSection'
import FABSection from './components/FABSection'
import SegmentedButtonSection from './components/SegmentedButtonSection'

// Components — Inputs
import TextFieldsSection from './components/TextFieldsSection'
import SelectSection from './components/SelectSection'
import DatePickerSection from './components/DatePickerSection'
import StepperSection from './components/StepperSection'
import SliderSection from './components/SliderSection'

// Components — Selection
import CheckboxSection from './components/CheckboxSection'
import RadioSection from './components/RadioSection'
import SwitchSection from './components/SwitchSection'
import ChipsSection from './components/ChipsSection'

// Components — Containment
import CardsSection from './components/CardsSection'
import DialogsSection from './components/DialogsSection'
import BottomSheetSection from './components/BottomSheetSection'

// Components — Lists & Data
import ListsSection from './components/ListsSection'
import DataTableSection from './components/DataTableSection'
import DividersSection from './components/DividersSection'
import BadgesSection from './components/BadgesSection'

// Components — Navigation
import ToolbarsSection from './components/ToolbarsSection'
import NavigationSection from './components/NavigationSection'
import TabsSection from './components/TabsSection'

// Components — Feedback
import ProgressSection from './components/ProgressSection'
import SnackbarsSection from './components/SnackbarsSection'
import TooltipsSection from './components/TooltipsSection'
import ValidationSection from './components/ValidationSection'

// Patterns
import PatternsOverview from './patterns/PatternsOverview'

export default function DesignSystem() {
  const [activeSection, setActiveSection] = useState('brand')

  const handleSectionChange = useCallback((id: string) => {
    setActiveSection(id)
  }, [])

  return (
    <div className="ds-page">
      {/* Skip link — accessibility: keyboard users skip past sidebar nav */}
      <a href="#main-content" className="ds-skip-link">Skip to content</a>
      <TopBar />

      {/* Hero — concise, scannable, one clear focal point */}
      <header className="ds-hero" role="banner">
        <div className="ds-hero-content">
          <div className="ds-hero-badge">Probe</div>
          <h1>
            <span>Quantify</span>
            Design System
          </h1>
          <p className="ds-hero-subtitle">
            The complete component library for Quantify. Probe design language, built for Uno Platform.
          </p>
          <div className="ds-hero-meta">
            <div className="ds-hero-meta-item">
              <span className="ds-hero-meta-value">27+</span>
              <span className="ds-hero-meta-label">Components</span>
            </div>
            <div className="ds-hero-meta-item">
              <span className="ds-hero-meta-value">19</span>
              <span className="ds-hero-meta-label">Screen patterns</span>
            </div>
            <div className="ds-hero-meta-item">
              <span className="ds-hero-meta-value">9</span>
              <span className="ds-hero-meta-label">Foundations</span>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Sidebar — always visible */}
      <Sidebar activeSection={activeSection} onNavigate={handleSectionChange} />

      {/* Main Layout — offset by sidebar width */}
      <div className="ds-layout">
        <ContentArea onSectionChange={handleSectionChange}>
          {/* ─── Foundations ─── */}
          <BrandSection />
          <ConventionsSection />
          <ColorSection />
          <TypographySection />
          <ElevationSection />
          <ShapeSection />
          <SpacingSection />
          <StatesSection />
          <MotionSection />

          {/* ─── Actions ─── */}
          <ButtonsSection />
          <IconButtonsSection />
          <FABSection />
          <SegmentedButtonSection />

          {/* ─── Inputs ─── */}
          <TextFieldsSection />
          <SelectSection />
          <DatePickerSection />
          <StepperSection />
          <SliderSection />

          {/* ─── Selection ─── */}
          <CheckboxSection />
          <RadioSection />
          <SwitchSection />
          <ChipsSection />

          {/* ─── Containment ─── */}
          <CardsSection />
          <DialogsSection />
          <BottomSheetSection />

          {/* ─── Lists & Data ─── */}
          <ListsSection />
          <DataTableSection />
          <DividersSection />
          <BadgesSection />

          {/* ─── Navigation ─── */}
          <ToolbarsSection />
          <NavigationSection />
          <TabsSection />

          {/* ─── Feedback ─── */}
          <ProgressSection />
          <SnackbarsSection />
          <TooltipsSection />
          <ValidationSection />

          {/* ─── Patterns ─── */}
          <PatternsOverview />

          {/* Footer */}
          <footer className="ds-footer">
            <div className="ds-footer-logo">QUANTIFY</div>
            <p className="ds-footer-text">
              Design System for Quantify · Probe Design Language · Uno Platform
            </p>
            <p className="ds-footer-copyright">
              © Avontus 2008–2025. All rights reserved.
            </p>
          </footer>
        </ContentArea>
      </div>
    </div>
  )
}
