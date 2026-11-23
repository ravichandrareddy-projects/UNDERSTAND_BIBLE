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

interface LineageNode {
  name: string;
  generation: number;
  period: string;
  passageRef: string;
  passageLink: string;
  desc: string;
}

const MESSIANIC_LINEAGE: LineageNode[] = [
  {
    name: 'Adam',
    generation: 1,
    period: 'Antediluvian',
    passageRef: 'Genesis 5:1–3',
    passageLink: '/read?book=GEN&chapter=5&verse=1',
    desc: 'The first man, created in the image and likeness of God.',
  },
  {
    name: 'Noah',
    generation: 10,
    period: 'The Great Flood',
    passageRef: 'Genesis 5:28–32',
    passageLink: '/read?book=GEN&chapter=5&verse=28',
    desc: 'A righteous man, blameless in his generation, who walked with God.',
  },
  {
    name: 'Abraham',
    generation: 20,
    period: 'Patriarchal Era',
    passageRef: 'Genesis 11:26–12:3',
    passageLink: '/read?book=GEN&chapter=12&verse=1',
    desc: 'The father of faith; called out of Ur with the covenant of blessing for all nations.',
  },
  {
    name: 'Judah',
    generation: 23,
    period: 'The 12 Patriarchs',
    passageRef: 'Genesis 49:8–10',
    passageLink: '/read?book=GEN&chapter=49&verse=8',
    desc: 'The royal tribe: "The scepter shall not depart from Judah until Shiloh comes."',
  },
  {
    name: 'King David',
    generation: 33,
    period: 'United Kingdom',
    passageRef: 'Ruth 4:18–22; 2 Samuel 7',
    passageLink: '/read?book=MAT&chapter=1&verse=6',
    desc: 'A man after God’s own heart; receiver of the everlasting throne covenant.',
  },
  {
    name: 'Jesus the Messiah',
    generation: 62,
    period: 'New Covenant',
    passageRef: 'Matthew 1:1–17; Luke 3:23–38',
    passageLink: '/read?book=MAT&chapter=1&verse=1',
    desc: 'The Son of David, the Son of Abraham, the fulfillment of all redemptive promises.',
  },
];

export default function VamsavaliPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) ?? 'en';
  const [selectedNode, setSelectedNode] = useState<LineageNode | null>(
    MESSIANIC_LINEAGE[0] ?? null,
  );

  const lineageContent = (
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
          Redemptive Lineage of Promise (Genesis to Christ)
        </h3>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            marginBlockEnd: 'var(--space-4)',
          }}
        >
          Explore historical generations across biblical records with verified
          scripture provenance. Separate accounts in Matthew 1 and Luke 3 are
          preserved faithfully without harmonisation.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {MESSIANIC_LINEAGE.map((node) => (
            <div
              key={node.name}
              onClick={() => setSelectedNode(node)}
              style={{
                cursor: 'pointer',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border:
                  selectedNode?.name === node.name
                    ? '2px solid #C5A15A'
                    : '1px solid var(--color-border)',
                backgroundColor:
                  selectedNode?.name === node.name ? '#F7F4EA' : '#FFFFFF',
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
                  {node.name}
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
                  Gen {node.generation}
                </span>
              </div>
              <div
                style={{ fontSize: '12px', color: '#8B7038', marginTop: '4px' }}
              >
                {node.period}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '8px',
                }}
              >
                {node.desc}
              </div>
              <div style={{ marginTop: '10px' }}>
                <Link
                  href={node.passageLink}
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
                  <span>Open {node.passageRef}</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const patriarchsContent = (
    <div className={`${styles.grid} ${styles.grid3}`}>
      <Card interactive>
        <CardTitle>Abraham & Sarah</CardTitle>
        <CardDescription>
          Father of a multitude of nations. Covenant of circumcision and the
          promise of Isaac (Genesis 12–25).
        </CardDescription>
        <div style={{ marginTop: '12px' }}>
          <Link
            href="/read?book=GEN&chapter=12&verse=1"
            locale={locale}
            style={{
              fontSize: '12px',
              color: '#C5A15A',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Read Genesis 12 →
          </Link>
        </div>
      </Card>
      <Card interactive>
        <CardTitle>Isaac & Rebekah</CardTitle>
        <CardDescription>
          Child of promise. Father of Esau and Jacob (Genesis 21–28).
        </CardDescription>
        <div style={{ marginTop: '12px' }}>
          <Link
            href="/read?book=GEN&chapter=24&verse=1"
            locale={locale}
            style={{
              fontSize: '12px',
              color: '#C5A15A',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Read Genesis 24 →
          </Link>
        </div>
      </Card>
      <Card interactive>
        <CardTitle>Jacob (Israel) & the 12 Tribes</CardTitle>
        <CardDescription>
          Wrestled with God at Peniel. Father of Reuben, Simeon, Levi, Judah,
          Dan, Naphtali, Gad, Asher, Issachar, Zebulun, Joseph, Benjamin
          (Genesis 29–50).
        </CardDescription>
        <div style={{ marginTop: '12px' }}>
          <Link
            href="/read?book=GEN&chapter=49&verse=1"
            locale={locale}
            style={{
              fontSize: '12px',
              color: '#C5A15A',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Read Genesis 49 →
          </Link>
        </div>
      </Card>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Vamsavali (వంశావళి)"
        subtitle="Explore biblical genealogy, ancestral lines, and historical family connections from Adam to the Messiah."
      />
      <PageContent>
        <Tabs
          tabs={[
            {
              id: 'messianic',
              label: 'Messianic Lineage',
              content: lineageContent,
            },
            {
              id: 'patriarchs',
              label: 'The Patriarchs & 12 Tribes',
              content: patriarchsContent,
            },
          ]}
        />
      </PageContent>
    </>
  );
}
