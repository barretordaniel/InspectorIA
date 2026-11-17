import { useEffect, useState } from 'react'
import { getToken } from './api'
import type { Screen } from './types'

import Header from './components/Header'
import Landing from './components/Landing'
import ReportStart from './components/ReportStart'
import ReportPhoto from './components/ReportPhoto'
import ReportAnalyzing from './components/ReportAnalyzing'
import ReportResult from './components/ReportResult'
import ReportLocation from './components/ReportLocation'
import ReportSummary from './components/ReportSummary'
import ReportSuccess from './components/ReportSuccess'
import ReportPDF from './components/ReportPDF'
import MapView from './components/MapView'
import MyReports from './components/MyReports'
import InstitutionalLogin from './components/InstitutionalLogin'
import InstitutionalLayout from './components/InstitutionalLayout'
import InstitutionalDashboard from './components/InstitutionalDashboard'
import InstitutionalReports from './components/InstitutionalReports'
import InstitutionalReportDetail from './components/InstitutionalReportDetail'
import ZoneHistory from './components/ZoneHistory'

const INST_SCREENS: Screen[] = [
  'inst-dashboard', 'inst-reports', 'inst-report-detail', 'inst-zone-history'
]

const NO_HEADER: Screen[] = [
  'report-start', 'report-photo', 'report-analyzing', 'report-result',
  'report-location', 'report-summary', 'report-success', 'report-pdf',
  'inst-login', 'inst-dashboard', 'inst-reports', 'inst-report-detail', 'inst-zone-history',
  'map',
]

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')

  function navigate(s: Screen) {
    setScreen(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const props = { navigate }

  useEffect(() => {
    const out = () => setScreen('inst-login')
    window.addEventListener('inspectoria:logout', out)
    return () => window.removeEventListener('inspectoria:logout', out)
  }, [])

  if (INST_SCREENS.includes(screen) && !getToken()) {
    return <InstitutionalLogin {...props} />
  }

  if (INST_SCREENS.includes(screen)) {
    return (
      <div className="h-full">
        <InstitutionalLayout navigate={navigate} currentScreen={screen}>
          {screen === 'inst-dashboard' && <InstitutionalDashboard {...props} />}
          {screen === 'inst-reports' && <InstitutionalReports {...props} />}
          {screen === 'inst-report-detail' && <InstitutionalReportDetail {...props} />}
          {screen === 'inst-zone-history' && <ZoneHistory {...props} />}
        </InstitutionalLayout>
      </div>
    )
  }

  if (screen === 'inst-login') {
    return <InstitutionalLogin {...props} />
  }

  if (screen === 'map') {
    return (
      <div className="h-full flex flex-col">
        <Header {...props} />
        <div className="flex-1 overflow-hidden">
          <MapView {...props} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-white">
      {!NO_HEADER.includes(screen) && <Header {...props} />}

      {screen === 'landing' && <Landing {...props} />}
      {screen === 'report-start' && <ReportStart {...props} />}
      {screen === 'report-photo' && <ReportPhoto {...props} />}
      {screen === 'report-analyzing' && <ReportAnalyzing {...props} />}
      {screen === 'report-result' && <ReportResult {...props} />}
      {screen === 'report-location' && <ReportLocation {...props} />}
      {screen === 'report-summary' && <ReportSummary {...props} />}
      {screen === 'report-success' && <ReportSuccess {...props} />}
      {screen === 'report-pdf' && <ReportPDF {...props} />}
      {screen === 'my-reports' && <MyReports {...props} />}
    </div>
  )
}
