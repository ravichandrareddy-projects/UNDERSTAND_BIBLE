'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ONBOARDING_LANGUAGES } from '../../../i18n/config';
import type { Locale } from '../../../i18n/config';
import {
  BIBLE_EDITIONS,
  getApprovedEditions,
  DEFAULT_PRIMARY_EDITION,
  DEFAULT_PARALLEL_EDITION,
} from '../../../data/bible/editions';
import type { BibleTradition } from '../../../data/bible/types';
import { Button } from '../../../components/ui/Button';
import styles from './onboarding.module.css';

interface OnboardingState {
  interfaceLanguage: string;
  tradition: BibleTradition;
  primaryEditionId: string;
  secondaryEditionId: string | null;
}

const STORAGE_KEY_ONBOARDING = 'understand_bible_user_onboarding';
const STORAGE_KEY_PREFS = 'understand_bible_reader_prefs';

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const currentLocale = (params?.locale as Locale) ?? 'en';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>(currentLocale);
  const [selectedTradition, setSelectedTradition] =
    useState<BibleTradition>('protestant');
  const [primaryEditionId, setPrimaryEditionId] = useState<string>(
    DEFAULT_PRIMARY_EDITION,
  );
  const [secondaryEditionId, setSecondaryEditionId] = useState<string | null>(
    DEFAULT_PARALLEL_EDITION,
  );
  const [comparisonEnabled, setComparisonEnabled] = useState<boolean>(true);

  // Filter approved editions matching selected tradition
  const approvedPrimaryEditions = useMemo(() => {
    const list = getApprovedEditions(selectedTradition);
    if (list.length > 0) return list;
    return getApprovedEditions(); // Fallback if no specific tradition matches
  }, [selectedTradition]);

  // Secondary comparative editions (approved, excluding primary)
  const approvedSecondaryEditions = useMemo(() => {
    return getApprovedEditions().filter((e) => e.id !== primaryEditionId);
  }, [primaryEditionId]);

  // Handle Step Advancement
  const handleNext = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Complete Onboarding and Persist Preferences
  const handleFinish = useCallback(() => {
    const finalPreferences: OnboardingState = {
      interfaceLanguage: selectedLanguage,
      tradition: selectedTradition,
      primaryEditionId,
      secondaryEditionId: comparisonEnabled ? secondaryEditionId : null,
    };

    try {
      localStorage.setItem(
        STORAGE_KEY_ONBOARDING,
        JSON.stringify(finalPreferences),
      );

      // Also sync to reader preferences
      const existingPrefs = localStorage.getItem(STORAGE_KEY_PREFS);
      const parsed = existingPrefs ? JSON.parse(existingPrefs) : {};
      localStorage.setItem(
        STORAGE_KEY_PREFS,
        JSON.stringify({
          ...parsed,
          primaryEditionId,
          secondaryEditionId: comparisonEnabled ? secondaryEditionId : null,
          tradition: selectedTradition,
          interfaceLanguage: selectedLanguage,
        }),
      );
    } catch {
      // Ignore localStorage errors
    }

    // Determine target route locale
    const targetLocale =
      selectedLanguage === 'te' || selectedLanguage === 'ar'
        ? selectedLanguage
        : 'en';
    router.push(
      `/${targetLocale}/read?openWithAnimation=true&book=GEN&chapter=1&verse=1`,
    );
  }, [
    selectedLanguage,
    selectedTradition,
    primaryEditionId,
    secondaryEditionId,
    comparisonEnabled,
    router,
  ]);

  return (
    <div className={styles.onboardingContainer}>
      {/* 5-Step Progress Bar */}
      <div
        className={styles.stepProgress}
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={5}
      >
        {[1, 2, 3, 4, 5].map((step) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          return (
            <div key={step} className={styles.stepDotItem}>
              <div
                className={`${styles.stepDot} ${isActive ? styles.stepDotActive : ''} ${isCompleted ? styles.stepDotCompleted : ''}`}
              >
                {isCompleted ? '✓' : step}
              </div>
              <span
                className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}
              >
                {step === 1 && 'Language'}
                {step === 2 && 'Tradition'}
                {step === 3 && 'Primary'}
                {step === 4 && 'Comparison'}
                {step === 5 && 'Confirm'}
              </span>
              {step < 5 && (
                <div
                  className={`${styles.stepDivider} ${step < currentStep ? styles.stepDividerActive : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* =========================================================
          STEP 1: INTERFACE LANGUAGE (14 Proposed Languages)
          ========================================================= */}
      {currentStep === 1 && (
        <section aria-labelledby="step1-title">
          <div className={styles.stepHeader}>
            <h1 id="step1-title" className={styles.stepTitle}>
              Select Your Interface Language
            </h1>
            <p className={styles.stepSubtitle}>
              Choose the language you prefer for navigation, headings, and
              menus. You can switch between translations and interface languages
              at any time.
            </p>
          </div>

          <div className={`${styles.optionGrid} ${styles.optionGrid4}`}>
            {ONBOARDING_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <div
                  key={lang.code}
                  className={`${styles.optionCard} ${isSelected ? styles.optionCardActive : ''}`}
                  onClick={() => setSelectedLanguage(lang.code)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedLanguage(lang.code);
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  <div className={styles.optionCardHeader}>
                    <span className={styles.optionName}>{lang.nativeName}</span>
                    {isSelected && (
                      <span className={styles.checkIndicator}>✓</span>
                    )}
                  </div>
                  <span className={styles.optionSubname}>{lang.name}</span>
                  <p className={styles.optionDesc}>
                    Script: {lang.script} · {lang.sampleGreeting}
                  </p>
                  <span className={styles.badgePill}>
                    {lang.routingSupported ? 'Full System' : 'Text Enabled'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================
          STEP 2: BIBLE TRADITION & CANON SELECTION
          ========================================================= */}
      {currentStep === 2 && (
        <section aria-labelledby="step2-title">
          <div className={styles.stepHeader}>
            <h1 id="step2-title" className={styles.stepTitle}>
              Choose Bible Tradition & Canon
            </h1>
            <p className={styles.stepSubtitle}>
              Understand Bible respects distinct canonical traditions. Different
              historical traditions include varying book collections and
              arrangements.
            </p>
          </div>

          <div className={styles.calloutNote}>
            <strong>Canonical Transparency Notice:</strong> Book availability
            varies by tradition and edition. For example, Catholic editions
            include 73 books (with Tobit, Judith, Wisdom, Sirach, Baruch, 1 & 2
            Maccabees), whereas Protestant editions contain 66 books. You can
            change this at any time in Settings.
          </div>

          <div className={`${styles.optionGrid} ${styles.optionGrid3}`}>
            {/* Protestant */}
            <div
              className={`${styles.optionCard} ${selectedTradition === 'protestant' ? styles.optionCardActive : ''}`}
              onClick={() => {
                setSelectedTradition('protestant');
                setPrimaryEditionId('eng-web');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  setSelectedTradition('protestant');
              }}
              aria-pressed={selectedTradition === 'protestant'}
            >
              <div className={styles.optionCardHeader}>
                <span className={styles.optionName}>Protestant Tradition</span>
                {selectedTradition === 'protestant' && (
                  <span className={styles.checkIndicator}>✓</span>
                )}
              </div>
              <span className={styles.optionSubname}>66 Canonical Books</span>
              <p className={styles.optionDesc}>
                39 Old Testament books based on the Masoretic Hebrew text and 27
                New Testament books. Includes World English Bible, Berean
                Standard Bible, and IRV editions.
              </p>
              <span className={styles.badgePill}>66 Books</span>
            </div>

            {/* Catholic */}
            <div
              className={`${styles.optionCard} ${selectedTradition === 'catholic' ? styles.optionCardActive : ''}`}
              onClick={() => {
                setSelectedTradition('catholic');
                setPrimaryEditionId('eng-dra');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  setSelectedTradition('catholic');
              }}
              aria-pressed={selectedTradition === 'catholic'}
            >
              <div className={styles.optionCardHeader}>
                <span className={styles.optionName}>Catholic Tradition</span>
                {selectedTradition === 'catholic' && (
                  <span className={styles.checkIndicator}>✓</span>
                )}
              </div>
              <span className={styles.optionSubname}>73 Canonical Books</span>
              <p className={styles.optionDesc}>
                Includes 7 Deuterocanonical books (Tobit, Judith, Wisdom,
                Sirach, Baruch, 1 & 2 Maccabees). Backed by verified public
                domain Douay-Rheims American 1899 edition.
              </p>
              <span className={styles.badgePill}>73 Books (Deuterocanon)</span>
            </div>

            {/* Orthodox */}
            <div
              className={`${styles.optionCard} ${selectedTradition === 'orthodox' ? styles.optionCardActive : ''}`}
              onClick={() => {
                setSelectedTradition('orthodox');
                setPrimaryEditionId('eng-web');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  setSelectedTradition('orthodox');
              }}
              aria-pressed={selectedTradition === 'orthodox'}
            >
              <div className={styles.optionCardHeader}>
                <span className={styles.optionName}>Eastern Orthodox</span>
                {selectedTradition === 'orthodox' && (
                  <span className={styles.checkIndicator}>✓</span>
                )}
              </div>
              <span className={styles.optionSubname}>
                Septuagint Canon Profile
              </span>
              <p className={styles.optionDesc}>
                Historical Eastern Christian biblical canon incorporating
                additional Septuagint texts (such as 3 Maccabees, Psalm 151, and
                Prayer of Manasseh).
              </p>
              <span className={styles.badgePill}>Septuagint Canon</span>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          STEP 3: PRIMARY BIBLE EDITION SELECTION
          ========================================================= */}
      {currentStep === 3 && (
        <section aria-labelledby="step3-title">
          <div className={styles.stepHeader}>
            <h1 id="step3-title" className={styles.stepTitle}>
              Select Primary Bible Edition
            </h1>
            <p className={styles.stepSubtitle}>
              This edition will serve as your default Scripture text throughout
              the reader, daily reading plans, and verse study. Showing only
              verified approved editions.
            </p>
          </div>

          <div className={styles.calloutNote}>
            <strong>Licensing & Rights Policy (G-LIC-1):</strong> Scripture
            texts are imported strictly verbatim from official approved sources.
            King James Version (KJV) is undergoing rights confirmation with
            publisher Crown copyright controls and is not displayed as available
            for initial selection.
          </div>

          <div className={`${styles.optionGrid} ${styles.optionGrid2}`}>
            {approvedPrimaryEditions.map((edition) => {
              const isSelected = primaryEditionId === edition.id;
              return (
                <div
                  key={edition.id}
                  className={`${styles.optionCard} ${isSelected ? styles.optionCardActive : ''}`}
                  onClick={() => setPrimaryEditionId(edition.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      setPrimaryEditionId(edition.id);
                  }}
                  aria-pressed={isSelected}
                >
                  <div className={styles.optionCardHeader}>
                    <span className={styles.optionName}>{edition.name}</span>
                    {isSelected && (
                      <span className={styles.checkIndicator}>✓</span>
                    )}
                  </div>
                  <span className={styles.optionSubname}>
                    {edition.code} · {edition.languageName}
                  </span>
                  <p className={styles.optionDesc}>{edition.copyright}</p>
                  <span className={styles.badgePill}>
                    {edition.licenseLabel} · {edition.booksCount} Books
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================
          STEP 4: OPTIONAL COMPARISON EDITION SELECTION
          ========================================================= */}
      {currentStep === 4 && (
        <section aria-labelledby="step4-title">
          <div className={styles.stepHeader}>
            <h1 id="step4-title" className={styles.stepTitle}>
              Choose Comparative Reading Edition
            </h1>
            <p className={styles.stepSubtitle}>
              Understand Bible supports side-by-side reading on desktop and
              stacked comparative comparison on mobile. Select an optional
              secondary edition (e.g. English + Telugu).
            </p>
          </div>

          {/* Toggle comparison on/off */}
          <div
            style={{
              marginBottom: 'var(--space-6)',
              display: 'flex',
              gap: 'var(--space-3)',
            }}
          >
            <Button
              variant={comparisonEnabled ? 'primary' : 'ghost'}
              onClick={() => setComparisonEnabled(true)}
            >
              Enable Parallel Comparison
            </Button>
            <Button
              variant={!comparisonEnabled ? 'primary' : 'ghost'}
              onClick={() => setComparisonEnabled(false)}
            >
              Single Translation Only
            </Button>
          </div>

          {comparisonEnabled && (
            <div className={`${styles.optionGrid} ${styles.optionGrid2}`}>
              {approvedSecondaryEditions.map((edition) => {
                const isSelected = secondaryEditionId === edition.id;
                return (
                  <div
                    key={edition.id}
                    className={`${styles.optionCard} ${isSelected ? styles.optionCardActive : ''}`}
                    onClick={() => setSecondaryEditionId(edition.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        setSecondaryEditionId(edition.id);
                    }}
                    aria-pressed={isSelected}
                  >
                    <div className={styles.optionCardHeader}>
                      <span className={styles.optionName}>{edition.name}</span>
                      {isSelected && (
                        <span className={styles.checkIndicator}>✓</span>
                      )}
                    </div>
                    <span className={styles.optionSubname}>
                      {edition.code} · {edition.languageName}
                    </span>
                    <p className={styles.optionDesc}>{edition.copyright}</p>
                    <span className={styles.badgePill}>
                      {edition.licenseLabel} · Comparative Mode
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =========================================================
          STEP 5: CONFIRM PREFERENCES
          ========================================================= */}
      {currentStep === 5 && (
        <section aria-labelledby="step5-title">
          <div className={styles.stepHeader}>
            <h1 id="step5-title" className={styles.stepTitle}>
              Confirm Your Preferences
            </h1>
            <p className={styles.stepSubtitle}>
              Review your customized reading setup. You can adjust your
              translations, canon tradition, and interface language at any time
              in the reader.
            </p>
          </div>

          <div className={styles.summaryBox}>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-primary)',
                marginBottom: '8px',
              }}
            >
              Your Reading Configuration
            </h3>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                marginBottom: '16px',
              }}
            >
              Preferences are stored locally for immediate distraction-free
              reading and will synchronize seamlessly across your devices once
              cloud accounts are enabled.
            </p>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>
                  Interface Language
                </div>
                <div className={styles.summaryItemValue}>
                  {ONBOARDING_LANGUAGES.find((l) => l.code === selectedLanguage)
                    ?.name ?? selectedLanguage}
                </div>
              </div>

              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>Bible Tradition</div>
                <div
                  className={styles.summaryItemValue}
                  style={{ textTransform: 'capitalize' }}
                >
                  {selectedTradition} (
                  {selectedTradition === 'catholic' ? '73 Books' : '66 Books'})
                </div>
              </div>

              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>
                  Primary Translation
                </div>
                <div className={styles.summaryItemValue}>
                  {BIBLE_EDITIONS.find((e) => e.id === primaryEditionId)
                    ?.name ?? primaryEditionId}
                </div>
              </div>

              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>
                  Comparative Translation
                </div>
                <div className={styles.summaryItemValue}>
                  {comparisonEnabled && secondaryEditionId
                    ? (BIBLE_EDITIONS.find((e) => e.id === secondaryEditionId)
                        ?.name ?? secondaryEditionId)
                    : 'Single Translation Mode'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Navigation Buttons Row */}
      <div className={styles.navRow}>
        <div>
          {currentStep > 1 && (
            <Button variant="ghost" onClick={handleBack}>
              ← Back
            </Button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {currentStep < 5 ? (
            <Button variant="primary" onClick={handleNext}>
              Continue →
            </Button>
          ) : (
            <Button variant="primary" onClick={handleFinish}>
              Enter Understand Bible 📖
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
