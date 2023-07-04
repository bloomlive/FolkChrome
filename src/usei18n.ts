import { I18n } from "i18n-js";

const useI18n = new I18n({
  en: {
    stages: {
      4936143: "Kaevumägi",
      4936237: "I Kirsimägi",
      4936238: "II Kirsimägi",
      4936243: "Viljand Song Festival Grounds",
      4936240: "Traditional Music Center",
      4936244: "St. John's Church",
      4936245: "Babtist Church",
      4938875: "Jaak Johanson Stage",
      default: "Viljandi Folk Music Festival"
    },
    calendarTypeLabel: "Pick your calendar type",
    description: {
      prefix: "See more here"
    },
    error: "Something went wrong.",
    formats: {
      ics: ".ics file",
    }
  },
  et: {
    stages: {
      4936143: "Kaevumägi",
      4936141: "I Kirsimägi",
      4936142: "II Kirsimägi",
      4936144: "Laululava",
      4936145: "Aida suur saal",
      4936147: "Jaani kirik",
      4936149: "Babtistikirik",
      4938876: "Jaak Johansoni Kultra lava",
      default: "Viljandi Pärimusmuusika festival"
    },
    calendarTypeLabel: "Vali oma kalendriliik",
    description: {
      prefix: "Vaata rohkem siit"
    },
    error: "Midagi läks valesti.",
    formats: {
      ics: ".ics fail",
    }
  }
});

export default useI18n;
