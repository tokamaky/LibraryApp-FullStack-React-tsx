import { Carousel } from "./components/Carousel"
import { ExploreTopBooks } from "./components/ExploreTopBooks"
import { Heros } from "./components/Heros"
import { LibraryServices } from "./components/LibraryServices"

export const Homepage =() => {
    return (
        /*  React specific way of saying return each of these as a single element  <></>*/
        <> 
        <ExploreTopBooks />
        <Carousel />
        <Heros />
        <LibraryServices />
        </>

    )
}