"use client";

import { useState } from "react";
// import HeroCms from "./HeroCms/HeroCms";
import BannerCms from "./BannerCms/BannerCms";
import GalleryCms from "./GalleryCms/GalleryCms";
import ShopCms from "./ShopCms/ShopCms";
import AboutCms from "./AboutCms/AboutCms";
import ContactCms from "./ContactCms/ContactCms";
import styles from "./Cms.module.css";

type TabKey =
  // | "hero"
  | "banner"
  | "gallery"
  | "shop"
  | "about"
  | "contact";

type Tab = {
  id: TabKey;
  label: string;
};

const TABS: Tab[] = [
  // { id: "hero", label: "Hero" },
  { id: "banner", label: "Banner" },
  { id: "gallery", label: "Gallery" },
  { id: "shop", label: "Shop" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function CmsTabs() {
  const [active, setActive] = useState<TabKey>("banner");

  const renderContent = () => {
    switch (active) {
      // case "hero":
      //   return <HeroCms />;
      case "banner":
        return <BannerCms />;
      case "gallery":
        return <GalleryCms />;
      case "shop":
        return <ShopCms />;
      case "about":
        return <AboutCms />;
      case "contact":
        return <ContactCms />;
    }
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>CMS Manager</h2>
          <p className={styles.subtitle}>
            Manage your site content. Pick a section to edit.
          </p>
        </div>
      </header>

      {/* TABS — single bar */}
      <div className={styles.tabsBar} role="tablist" aria-label="CMS sections">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`cms-panel-${tab.id}`}
              className={`${styles.tab} ${
                isActive ? styles.tabActive : ""
              }`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <section
        id={`cms-panel-${active}`}
        role="tabpanel"
        className={styles.content}
      >
        {renderContent()}
      </section>
    </div>
  );
}
