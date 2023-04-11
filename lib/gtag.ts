export const GA_TRACKING_ID = 'G-V8TBYKVNRE'

/**
 *
 * @param {string} url
 */
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

/**
 *
 * @param {object} params
 * @param {string} params.action
 * @param {string} params.category
 * @param {string} params.label
 * @param {string} params.value
 */
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
