'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '../../../i18n/navigation';
import type { Locale } from '../../../i18n/config';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageContent } from '../../../components/layout/PageContent';
import { Tabs } from '../../../components/ui/Tabs';
import { Card, CardTitle, CardDescription } from '../../../components/ui/Card';
import styles from '../../../components/pages/pages.module.css';

interface BiblicalPlace {
  id: string;
  name: string;
  modernName: string;
  region: string;
  coordinates: string;
  keyPassage: string;
  passageLink: string;
  significance: string;
}

const BIBLICAL_PLACES: BiblicalPlace[] = [
  {
    id: 'jerusalem',
    name: 'Jerusalem (Zion)',
    modernName: 'Al-Quds / Jerusalem',
    region: 'Judea / Central Highlands',
    coordinates: '31.7683° N, 35.2137° E',
    keyPassage: 'Psalm 122:1–3',
    passageLink: '/read?book=PSA&chapter=122&verse=1',
    significance:
      'City of David, site of the Temple of Yahweh, and locus of the crucifixion, resurrection, and ascension of Christ.',
  },
  {
    id: 'galilee',
    name: 'Sea of Galilee (Kinneret)',
    modernName: 'Lake Tiberias',
    region: 'Galilee / Northern Israel',
    coordinates: '32.8224° N, 35.5828° E',
    keyPassage: 'Matthew 4:18–22',
    passageLink: '/read?book=MAT&chapter=4&verse=18',
    significance:
      'Center of Jesus’ public ministry, miracles of walking on water and calming the storm, and calling of the first disciples.',
  },
  {
    id: 'bethlehem',
    name: 'Bethlehem Ephrathah',
    modernName: 'Beit Lahm',
    region: 'Judah',
    coordinates: '31.7054° N, 35.2024° E',
    keyPassage: 'Micah 5:2; Luke 2:4–7',
    passageLink: '/read?book=MAT&chapter=2&verse=1',
    significance:
      'City of David and prophesied birthplace of the Messiah King.',
  },
  {
    id: 'nazareth',
    name: 'Nazareth',
    modernName: 'En-Nasira',
    region: 'Lower Galilee',
    coordinates: '32.6996° N, 35.3035° E',
    keyPassage: 'Luke 4:16–30',
    passageLink: '/read?book=MAT&chapter=2&verse=23',
    significance:
      'Childhood home of Jesus where He grew in wisdom and stature, and where He read Isaiah 61 in the synagogue.',
  },
  {
    id: 'sinai',
    name: 'Mount Sinai (Horeb)',
    modernName: 'Jabal Musa',
    region: 'Sinai Peninsula',
    coordinates: '28.5394° N, 33.9750° E',
    keyPassage: 'Exodus 19:16–20:17',
    passageLink: '/read?book=GEN&chapter=15&verse=1',
    significance:
      'Mountain of God where the covenant of the Law and the Ten Commandments were delivered to Moses.',
  },
];

export default function GeographyPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) ?? 'en';
  const [selectedPlace, setSelectedPlace] = useState<BiblicalPlace | null>(
    BIBLICAL_PLACES[0] ?? null,
  );

  const placesContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-lg)',
            color: 'var(--color-primary)',
            marginBlockEnd: 'var(--space-2)',
          }}
        >
          Key Biblical Locations & Provenance
        </h3>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            marginBlockEnd: 'var(--space-4)',
          }}
        >
          Explore biblical locations connected directly with chapter contexts,
          ancient vs. modern place names, and geographical coordinates.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {BIBLICAL_PLACES.map((place) => (
            <div
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              style={{
                cursor: 'pointer',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border:
                  selectedPlace?.id === place.id
                    ? '2px solid #C5A15A'
                    : '1px solid var(--color-border)',
                backgroundColor:
                  selectedPlace?.id === place.id ? '#F7F4EA' : '#FFFFFF',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{ fontWeight: 600, color: 'var(--color-primary)' }}
                >
                  {place.name}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: '#EAE5D8',
                    color: '#183D32',
                    fontWeight: 600,
                  }}
                >
                  {place.region}
                </span>
              </div>
              <div
                style={{ fontSize: '12px', color: '#8B7038', marginTop: '4px' }}
              >
                Modern: {place.modernName} · {place.coordinates}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '8px',
                }}
              >
                {place.significance}
              </div>
              <div style={{ marginTop: '10px' }}>
                <Link
                  href={place.passageLink}
                  locale={locale}
                  style={{
                    fontSize: '12px',
                    color: '#C5A15A',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Open {place.keyPassage}</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const journeysContent = (
    <div className={`${styles.grid} ${styles.grid3}`}>
      <Card interactive>
        <CardTitle>The Exodus Route</CardTitle>
        <CardDescription>
          From Rameses in Goshen through the Red Sea, the Wilderness of Sin,
          Mount Sinai, and Kadesh Barnea.
        </CardDescription>
        <div style={{ marginTop: '12px' }}>
          <Link
            href="/read?book=GEN&chapter=1&verse=1"
            locale={locale}
            style={{
              fontSize: '12px',
              color: '#C5A15A',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Study Exodus Narrative →
          </Link>
        </div>
      </Card>
      <Card interactive>
        <CardTitle>Galilean & Judean Ministries</CardTitle>
        <CardDescription>
          Jesus’ journeys between Nazareth, Capernaum, Bethsaida, Samaria
          (Sychar), and Jerusalem for the pilgrim feasts.
        </CardDescription>
        <div style={{ marginTop: '12px' }}>
          <Link
            href="/read?book=JHN&chapter=3&verse=1"
            locale={locale}
            style={{
              fontSize: '12px',
              color: '#C5A15A',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Read John 3 (Sychar context) →
          </Link>
        </div>
      </Card>
      <Card interactive>
        <CardTitle>Paul’s Missionary Journeys</CardTitle>
        <CardDescription>
          Antioch to Cyprus, Galatia, Macedonia (Philippi, Thessalonica), Achaia
          (Athens, Corinth), Ephesus, and Rome.
        </CardDescription>
        <div style={{ marginTop: '12px' }}>
          <Link
            href="/read?book=ROM&chapter=1&verse=1"
            locale={locale}
            style={{
              fontSize: '12px',
              color: '#C5A15A',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Explore Romans 1 →
          </Link>
        </div>
      </Card>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Biblical Geography (భౌగోళిక సమాచారం)"
        subtitle="Discover ancient biblical places, historical journeys, and archaeological connections across the Holy Land."
      />
      <PageContent>
        <Tabs
          tabs={[
            { id: 'places', label: 'Biblical Places', content: placesContent },
            {
              id: 'journeys',
              label: 'Biblical Journeys',
              content: journeysContent,
            },
          ]}
        />
      </PageContent>
    </>
  );
}
