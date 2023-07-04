import { CalendarEvent, google, ics, office365, outlook, yahoo } from "calendar-link";
import { IEventFileType } from "../types/IEventFileType";

const rows = document.querySelectorAll(".event-row");

let currentType: IEventFileType = "ics";

const locations = new Map<number, string>()
  .set(4936143, "Kaevumägi")
  .set(4936141, "I Kirsimägi")
  .set(4936142, "II Kirsimägi")
  .set(4936144, "Laululava")
  .set(4936145, "Aida suur saal")
  .set(4936147, "Jaani kirik")
  .set(4936149, "Babtistikirik")
  .set(4938876, "Jaak Johansoni Kultra lava");

const linkType = new Map<IEventFileType, string>()
  .set("ics", "iCal")
  .set("google", "Google Calendar")
  .set("yahoo", "Yahoo Calendar")
  .set("outlook", "Outlook.com")
  .set("office365", "Office 365");

function createButton(): HTMLElement {
  const button = document.createElement("a");

  button.style.position = "absolute";
  button.style.fontWeight = "medium";
  button.style.background = "none";
  button.style.border = "none";
  button.style.padding = "4px";
  button.style.fontSize = "1rem";
  button.style.cursor = "pointer";
  button.innerText = "+";

  styleButtonResponsive(isMobile(), button);

  return button;
}

function isMobile(): boolean {
  return window.innerWidth < 993;
}

function getEventData(row: Element): CalendarEvent {
  const start = row.getAttribute("data-box-start");
  const duration = Number((row as HTMLElement).style.height?.replace("px", "")) / 80;

  const startTime = new Date(Number(start) * 1000);
  const endTime = new Date(Number(start) * 1000 + duration * 60 * 60 * 1000);

  if (startTime.getHours() < 6) {
    startTime.setDate(startTime.getDate() + 1);
    endTime.setDate(endTime.getDate() + 1);
  }

  return {
    title: row.querySelector(".title")?.querySelector("div")?.textContent?.trim() ?? "Something went wrong.",
    description: "Vaata rohkem siit: " + row.querySelector("a")?.href ?? "https://www.viljandifolk.ee/",
    start: startTime,
    end: endTime,
    location: location
      ? locations.get(Number(row.parentElement?.parentElement?.parentElement?.getAttribute("data-id")))
      : "Viljandi Pärimusmuusika Festival"
  };
}

function createEventHref(row: Element): string {
  const data = getEventData(row);

  switch (currentType) {
    case "google":
      return google(data);
    case "yahoo":
      return yahoo(data);
    case "outlook":
      return outlook(data);
    case "office365":
      return office365(data);
    case "ics":
      return ics(data);
    default:
      return ics(data);
  }
}

function styleButtonResponsive(isMobile: boolean, button: HTMLElement) {
  button.style.left = isMobile ? "10px" : "0";
  button.style.top = isMobile ? "0" : "0";
}

function addSelector() {
  const element = document.querySelector(".nav-links.d-flex");
  const selector = document.createElement("select");
  selector.setAttribute("id", "calendar-link-selector");
  selector.style.marginBottom = "12px";
  selector.style.fontSize = "1rem";

  linkType.forEach((value, key) => {
    const option = document.createElement("option");
    option.value = key;
    option.text = value;
    selector.appendChild(option);
  });

  selector.addEventListener("change", function() {
    currentType = this.value as IEventFileType;
  });

  if (element) {
    element.after(selector);
    const label = document.createElement("label");
    label.innerText = "Vali kalendri tüüp: ";
    label.style.marginRight = "4px";
    selector.before(label);
  }
}

rows.forEach((row: Element) => {
  ;(row as HTMLElement).style.position = "relative";

  const button = createButton();

  button.setAttribute('href', createEventHref(row));
  button.setAttribute('target', '_blank')
  button.setAttribute("download", row.querySelector(".title")?.querySelector("div")?.textContent?.trim()!);

  console.log(row.querySelector("a")?.getAttribute("href")?.replace("#", ""));

  row.querySelector("a")?.after(button);

  window.addEventListener("resize", () => {
    styleButtonResponsive(isMobile(), button);
  });

  button.addEventListener("mouseenter", () => {
    button.style.color = "#b31b34";
  });

  button.addEventListener("mouseleave", () => {
    button.style.color = "black";
  });
});

addSelector();
