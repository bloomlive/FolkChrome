import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link'
import useI18n from "./usei18n";

import type { IEventFileType } from '../types/IEventFileType'
import type { ILanguage } from '../types/ILanguage'
import usei18n from "./usei18n";

const rows = document.querySelectorAll('.event-row')

let currentType: IEventFileType = 'ics'

const currentLanguage: ILanguage = document.querySelector('html')!.getAttribute('lang')! as ILanguage

useI18n.locale = currentLanguage;

const linkType = new Map<IEventFileType, string>()
    .set('ics', useI18n.t("formats.ics"))
    .set('google', 'Google Calendar')
    .set('yahoo', 'Yahoo Calendar')
    .set('outlook', 'Outlook.com')
    .set('office365', 'Office 365')

function createButton(): HTMLElement {
    const button = document.createElement('a')

    button.style.position = 'absolute'
    button.style.fontWeight = 'medium'
    button.style.background = 'none'
    button.style.border = 'none'
    button.style.padding = '4px'
    button.style.fontSize = '1rem'
    button.style.cursor = 'pointer'
    button.innerText = '+'

    styleButtonResponsive(isMobile(), button)

    return button
}

function isMobile(): boolean {
    return window.innerWidth < 993
}

function getEventData(row: Element): CalendarEvent {
    const start = row.getAttribute('data-box-start')
    const duration = Number((row as HTMLElement).style.height?.replace('px', '')) / 80

    const startTime = new Date(Number(start) * 1000)
    const endTime = new Date(Number(start) * 1000 + duration * 60 * 60 * 1000)

    if (startTime.getHours() < 6) {
        startTime.setDate(startTime.getDate() + 1)
        endTime.setDate(endTime.getDate() + 1)
    }

    return {
        title: row.querySelector('.title')?.querySelector('div')?.textContent?.trim() ?? useI18n.t("error"),
        description: useI18n.t("description.prefix") + ': ' + row.querySelector('a')?.href ?? 'https://www.viljandifolk.ee/',
        start: startTime,
        end: endTime,
        location: location
            ? usei18n.t("stages." + Number(row.parentElement?.parentElement?.parentElement?.getAttribute('data-id')))
            : useI18n.t("stages.default")
    }
}

function createEventHref(row: Element): string {
    const data = getEventData(row)

    switch (currentType) {
        case 'google':
            return google(data)
        case 'yahoo':
            return yahoo(data)
        case 'outlook':
            return outlook(data)
        case 'office365':
            return office365(data)
        case 'ics':
            return ics(data)
        default:
            return ics(data)
    }
}

function styleButtonResponsive(isMobile: boolean, button: HTMLElement) {
    button.style.left = isMobile ? '10px' : '0'
    button.style.top = isMobile ? '0' : '0'
}

function addSelector() {
    const element = document.querySelector('.nav-links.d-flex')
    const selector = document.createElement('select')
    selector.setAttribute('id', 'calendar-link-selector')
    selector.style.marginBottom = '12px'
    selector.style.fontSize = '1rem'

    linkType.forEach((value, key) => {
        const option = document.createElement('option')
        option.value = key
        option.text = value
        selector.appendChild(option)
    })

    selector.addEventListener('change', function () {
        currentType = this.value as IEventFileType
        document.querySelectorAll('.calendar-link-add').forEach((link: Element) => {
            link.parentElement?.removeChild(link)
        })

        createAddButtons()
    })

    if (element) {
        element.after(selector)
        const label = document.createElement('label')
        label.setAttribute('for', 'calendar-link-selector')
        label.innerText = useI18n.t('calendarTypeLabel') + ' '
        label.style.marginRight = '4px'
        selector.before(label)
    }
}

function createAddButtons() {
    rows.forEach((row: Element) => {
        ;(row as HTMLElement).style.position = 'relative'

        const button = createButton()

        button.classList.add('calendar-link-add')

        button.setAttribute('href', createEventHref(row))
        button.setAttribute('target', '_blank')
        button.setAttribute(
            'download',
            row.querySelector('.title')?.querySelector('div')?.textContent?.trim()! + '.ics'
        )

        row.querySelector('a')?.after(button)

        window.addEventListener('resize', () => {
            styleButtonResponsive(isMobile(), button)
        })

        button.addEventListener('mouseenter', () => {
            button.style.color = '#b31b34'
        })

        button.addEventListener('mouseleave', () => {
            button.style.color = 'black'
        })
    })
}

addSelector()
createAddButtons()
