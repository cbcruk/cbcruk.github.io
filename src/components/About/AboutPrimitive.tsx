import { twc } from 'react-twc'

export const AboutSection = twc.div`flex flex-col gap-[4px]`

export const AboutSectionTitle = twc.h2``

export const AboutSectionBody = twc.div`py-1`

export const AboutCompanyList = twc.ol`flex flex-col gap-1 text-sm`

export const AboutCompanyItem = twc.li`flex gap-2 items-center data-[is-closure='true']:line-through data-[is-freelancer='true']:text-gray-500`
