import MapGallery from "./Mapgallery";
import StoreList from "./storelist";


export default function Mainthing() {
    return (
      <>
        <section style={{maxWidth:'1920px'}}>
          <MapGallery />
        </section>
        <section style={{maxWidth:'1920px'}}>
          <StoreList />
        </section>
      </>
    )
  }