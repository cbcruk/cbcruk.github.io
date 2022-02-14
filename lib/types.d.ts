export type About = {
  company: {
    end_date: string
    is_closure: boolean
    is_freelancer: boolean
    name: string
    start_date: string
  }[]
  description: string
}

export type Links = {
  name: string
  url: string
}[]
