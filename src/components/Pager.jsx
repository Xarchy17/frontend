import { useLanguage } from '../context/LanguageContext.jsx'

export default function Pager({ text }) {
  const { t } = useLanguage()
  const translatedText = text
    .replace('Menampilkan', t('Menampilkan'))
    .replace(' dari ', ` ${t('dari')} `)
    .replace(' entri', ` ${t('entri')}`)
    .replace(' supplier', ` ${t('supplier')}`)
    .replace(' staff', ` ${t('staff')}`)
    .replace(' produk', ` ${t('produk')}`)
  return (
    <div className="pager">
      <span>{translatedText}</span>
      <div><button>‹</button><button className="on">1</button><button>2</button><button>3</button><button>›</button></div>
    </div>
  )
}
