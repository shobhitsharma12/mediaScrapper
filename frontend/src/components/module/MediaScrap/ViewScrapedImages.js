// External files import
import React from 'react'
import axios from 'axios'

// Internal files import
import {
   API_DOMAIN,
   COMMON_API_HEADERS,
   TOKEN,
   ADMIN_TOKEN,
   NUMBER_OF_IMAGE,
   ALL,
   INITIAL_POINT,
   SHOW_MEDIA_SCRAP_API,
   MIN_LIMIT,
   PAGINATION_LIMIT
} from '../../../config/constant'

class ViewScrapedImages extends React.Component {
   constructor(props) {
      super(props)

      // Initialise State
      this.state = {
         searchText: '',
         count: 0,
         imgData: [],
         currentPage: 0
      }
   }

   // Call after render component
   componentDidMount() {
      let headers = COMMON_API_HEADERS
      headers[ADMIN_TOKEN] = TOKEN
      axios.get(API_DOMAIN + `${SHOW_MEDIA_SCRAP_API}${INITIAL_POINT}/${NUMBER_OF_IMAGE}/${ALL}`, { headers })
         .then((response) => {
            if (response &&
               response.data &&
               response.data.count &&
               response.data.count > 0) {
               this.setState({
                  imgData: response.data.data,
                  count: response.data.count
               })
            }
         })
   }

   // Update Search Text String
   updateSearchText = (e) => {
      this.setState({
         searchText: e.target.value
      })
   }

   // Search Scrapped Media Data for search text
   searchData = () => {
      let headers = COMMON_API_HEADERS
      headers[ADMIN_TOKEN] = TOKEN
      let { searchText } = this.state
      if (!searchText) {
         searchText = ALL
      }
      axios.get(API_DOMAIN + `${SHOW_MEDIA_SCRAP_API}${INITIAL_POINT}/${NUMBER_OF_IMAGE}/${searchText}`, { headers })
         .then((response) => {
            if (response &&
               response.data &&
               response.data.count &&
               response.data.count > 0) {
               this.setState({
                  imgData: response.data.data,
                  count: response.data.count
               })
            } else {
               this.setState({
                  imgData: [],
                  count: 0
               })
            }
         })
   }

   // Click on Pagination Previous button
   updatePrevious = () => {
      const { currentPage } = this.state
      if (currentPage > MIN_LIMIT) {
         this.setState({
            currentPage: currentPage - PAGINATION_LIMIT
         })
      }
   }

   // Click on Pagination Next button
   updateNext = () => {
      const {
         currentPage,
         count
      } = this.state
      if (currentPage < count) {
         this.setState({
            currentPage: currentPage + PAGINATION_LIMIT
         })
      }
   }

   // Get Pagination Data for a page
   getPaginationData = (pageNumber) => {
      let headers = COMMON_API_HEADERS
      headers[ADMIN_TOKEN] = TOKEN
      let { searchText } = this.state
      if (!searchText) {
         searchText = 'all'
      }
      axios.get(API_DOMAIN + `${SHOW_MEDIA_SCRAP_API}${pageNumber}/${NUMBER_OF_IMAGE}/${searchText}`, { headers })
         .then((response) => {
            if (response &&
               response.data &&
               response.data.count &&
               response.data.count > 0) {
               this.setState({
                  imgData: response.data.data,
                  count: response.data.count
               })
            }
         })
   }

   // Render Scraped Image Viewer
   renderScrapedImageViewer = () => {
      return <center>
         {this.renderImageScrapperHeading()}
         <br />
         {this.renderSearchForm()}
         <div className='row'>
            {this.renderImageData()}
         </div>
         <br />
         {this.renderPagination()}
      </center>
   }

   // Render Image Scrapper Heading
   renderImageScrapperHeading = () => {
      return <div className='header'>
         <h1>Media Scrapper</h1>
         <p>Showing scrapped image here</p>
      </div>
   }

   // Render Search Form
   renderSearchForm = () => {
      const { searchText } = this.state
      return <form className='form-inline'>
         <div className='form-group mx-sm-3 mb-2'>
            <label htmlFor='SearchImage' className='sr-only'>Search Image</label>
            <input type='text'
               className='form-control'
               id='SearchImage'
               placeholder='Search Image'
               value={searchText}
               onChange={this.updateSearchText} />
         </div>
         <button type='button'
            className='btn btn-primary mb-2'
            onClick={this.searchData}>Search</button>
      </form>
   }

   // Render Image Data
   renderImageData = () => {
      const { imgData } = this.state
      const imageHtml = []
      if (imgData && imgData.length) {
         imgData.map((data, index) => {
            if (data && data.ImageUrl) {
               imageHtml.push(<div className='column' key={index}>
                  <img src={data.ImageUrl} style={{ width: '100%', height: '200px' }} />
               </div>)
            }
         })
         return imageHtml
      }
      return null
   }

   // Render Pagination
   renderPagination = () => {
      const {
         currentPage,
         count
      } = this.state
      if (count && (count > 11)) {
         return <nav aria-label='Page navigation example'>
            <ul className='pagination'>
               {(currentPage > 2 && count > 30) ? <li className='page-item'><a className='page-link' onClick={this.updatePrevious}>Previous</a></li> : ''}
               <li className='page-item' onClick={() => this.getPaginationData(currentPage + 1)}><a className='page-link'>{currentPage + 1}</a></li>
               <li className='page-item' onClick={() => this.getPaginationData(currentPage + 2)}><a className='page-link'>{currentPage + 2}</a></li>
               <li className='page-item' onClick={() => this.getPaginationData(currentPage + 3)}><a className='page-link'>{currentPage + 3}</a></li>
               {((currentPage < parseInt(count / NUMBER_OF_IMAGE) - 2) && count > (NUMBER_OF_IMAGE * PAGINATION_LIMIT)) ? <li className='page-item'>
                  <a className='page-link' onClick={this.updateNext}>Next</a>
               </li> : ''}
            </ul>
         </nav>
      }
      if (count == 0) {
         return <h3>No Data Found</h3>
      }
      return null
   }

   // Render
   render() {
      return (
         <div>{this.renderScrapedImageViewer()}</div>
      )
   }
}

export default ViewScrapedImages