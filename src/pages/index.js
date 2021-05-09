import styles from '../styles/Home.module.css'
import Layout from "../components/Layout/Layout";
import SearchInput from "../components/SearchInput/SearchInput";
import CountriesTable from '../components/CountriesTable/CountriesTable';
import { useState } from "react";

export default function Home({countries}) {
  const [keyword, setKeyword] = useState('');
  const filteredCountries = countries.filter(country => {
    if (country['Country_text'] != undefined) {
      return country['Country_text'].toLowerCase().includes(keyword);
    }
  });

  const onInputChange = (event) => {
    event.preventDefault();
    setKeyword(event.target.value.toLowerCase());
  }

  return (
    <Layout>
      <div className={styles.input_container}>
        <div className={styles.count}>
          Found {countries.length} Countries
        </div>
        <div className={styles.input}>
          <SearchInput placeholder="Filter by Name, Region, or Sub-Region" onChange={onInputChange}/>

        </div>
      </div>

      <CountriesTable countries={filteredCountries}/>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const res = await fetch("https://covid-19-tracking.p.rapidapi.com/v1?rapidapi-key=c91ed370f8msh532ba50d892af34p13a3ccjsn5d76659a874e");
  const countries = await res.json();

  return {
    props: {
      countries
    }
  }

}
