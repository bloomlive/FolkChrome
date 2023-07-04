import { google, ics, office365, outlook, yahoo } from "calendar-link";

const rows = document.querySelectorAll(".event-row");

let currentType: IEventType = "ics";

const locations = new Map()
  .set(4936143, "Kaevumägi")
  .set(4936141, "I Kirsimägi")
  .set(4936142, "II Kirsimägi")
  .set(4936144, "Laululava")
  .set(4936145, "Aida suur saal")
  .set(4936147, "Jaani kirik")
  .set(4936149, "Babtistikirik")
  .set(4938876, "Jaak Johansoni Kultra lava");

const linkType = new Map<IEventType, string>()
  .set("ics", "iCal")
  .set("google", "Google Calendar")
  .set("yahoo", "Yahoo Calendar")
  .set("outlook", "Outlook.com")
  .set("office365", "Office 365");

type IEventType = "google" | "yahoo" | "outlook" | "office365" | "ics"

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

function createEventHref(
  row: Element,
  type: IEventType
): string {
  const start = row.getAttribute("data-box-start");
  const duration = Number((row as HTMLElement).style.height?.replace("px", "")) / 80;

  const startTime = new Date(Number(start) * 1000);
  const endTime = new Date(Number(start) * 1000 + duration * 60 * 60 * 1000);

  if (startTime.getHours() < 6) {
    startTime.setDate(startTime.getDate() + 1);
    endTime.setDate(endTime.getDate() + 1);
  }

  const data = {
    title: row.querySelector(".title")?.querySelector("div")?.textContent?.trim() ?? "Something went wrong.",
    description: "Vaata rohkem siit: " + row.querySelector("a")?.href ?? "https://www.viljandifolk.ee/",
    start: startTime,
    end: endTime,
    location: location ? locations.get(Number(row.parentElement?.parentElement?.parentElement?.getAttribute("data-id"))) : "Viljandi Pärimusmuusika Festival"
  };

  switch (type) {
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
  selector.id = "calendar-link-selector";
  selector.style.marginBottom = "12px";

  linkType.forEach((value, key) => {
    const option = document.createElement("option");
    option.value = key;
    option.text = value;
    selector.appendChild(option);
  });

  selector.addEventListener("change", function(e) {
    currentType = this.value as IEventType;
  });

  if (element) {
    element.after(selector);
  }
}

rows.forEach((row: Element) => {
  ;(row as HTMLElement).style.position = "relative";

  const button = createButton();

  button.addEventListener("click", e => {
    e.preventDefault();
    window.open(createEventHref(row, currentType), "_blank");
  });

  row.querySelector("a")?.after(button);

  window.addEventListener("resize", e => {
    styleButtonResponsive(isMobile(), button);
  });

  button.addEventListener("mouseenter", e => {
    button.style.color = "#b31b34";
  });

  button.addEventListener("mouseleave", e => {
    button.style.color = "black";
  });
});

addSelector();
