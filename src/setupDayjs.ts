import dayjs from 'dayjs'
import 'dayjs/locale/nl-be'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import duration from 'dayjs/plugin/duration'

dayjs.extend(localizedFormat)
dayjs.locale('nl-be')
dayjs.extend(duration)
