const rows = document.querySelectorAll('.event-row')

const locations = new Map()
    .set(4936143, 'Kaevumägi')
    .set(4936141, 'I Kirsimägi')
    .set(4936142, 'II Kirsimägi')
    .set(4936144, 'Laululava')
    .set(4936145, 'Aida suur saal')
    .set(4936147, 'Jaani kirik')
    .set(4936149, 'Babtistikirik')
    .set(4938876, 'Jaak Johansoni Kultra lava')

function createButton(): HTMLElement {
    const button = document.createElement('a')
    button.innerText = '+'
    button.style.position = 'absolute'
    button.style.fontWeight = 'semibold'
    button.style.left = '0'
    button.style.top = '0'
    button.style.background = 'none'
    button.style.border = 'none'

    return button
}

function createUrl(row: Element, startTime: string, endTime: string, locationId: number, detailsUrl: string): string {
    const url = new URL('https://www.google.com/calendar/render')
    url.searchParams.append('action', 'TEMPLATE')
    url.searchParams.append(
        'text',
        row.querySelector('.title')?.querySelector('div')?.textContent?.trim() ?? 'Something went wrong.'
    )
    url.searchParams.append('dates', `${startTime}/${endTime}`)
    url.searchParams.append('details', 'Vaata rohkem siit: ' + detailsUrl)
    url.searchParams.append('location', location ? locations.get(locationId) : 'Viljandi Pärimusmuusika Festival')
    url.searchParams.append('sf', 'true')
    url.searchParams.append('output', 'xml')

    return url.toString()
}

rows.forEach((row: Element) => {
    ;(row as HTMLElement).style.position = 'relative'

    const button = createButton()

    const start = row.getAttribute('data-box-start')
    const duration = Number((row as HTMLElement).style.height?.replace('px', '')) / 80

    const startTime = new Date(Number(start) * 1000).toISOString().replace(/-|:|\.\d+/g, '')

    const endTime = new Date(Number(start) * 1000 + duration * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '')

    const location = Number(row.parentElement?.parentElement?.parentElement?.getAttribute('data-id'))

    const detailsUrl = row.querySelector('a')?.href ?? 'https://www.viljandifolk.ee/'

    button.setAttribute('href', createUrl(row, startTime, endTime, location, detailsUrl))
    button.setAttribute('target', '_blank')

    row.querySelector('a')?.after(button)
})
