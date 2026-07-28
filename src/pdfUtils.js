import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DAYS } from './constants'

export function buildSchedulePdf(child, items) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text(`Jadwal Harian ${child.name}`, 14, 18)

  const sorted = items.slice().sort((a, b) => a.time.localeCompare(b.time))

  const head = [['Jam', 'Kegiatan', ...DAYS.map((d) => d.label)]]
  const body = sorted.map((item) => [
    (item.time?.slice(0, 5) || '') + (item.end_time ? ` – ${item.end_time.slice(0, 5)}` : ''),
    `${item.icon || ''} ${item.title}`,
    ...DAYS.map((d) => ((item.days || []).includes(d.key) ? 'v' : '')),
  ])

  autoTable(doc, {
    head,
    body,
    startY: 26,
    styles: { fontSize: 9, halign: 'center' },
    columnStyles: { 1: { halign: 'left' } },
    headStyles: { fillColor: [255, 138, 91] },
  })

  return doc
}

export function buildSchedulePdfBase64(child, items) {
  const doc = buildSchedulePdf(child, items)
  // datauristring gives "data:application/pdf;filename=...;base64,XXXX" — strip the prefix
  const dataUri = doc.output('datauristring')
  return dataUri.split(',')[1]
}
