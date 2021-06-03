import React, { useState } from "react";
import { StyledPageNumber, StyledPaginator } from "../../Styles";

let Paginator = ({
   totalItemsCount,
   pageSize,
   currentPage,
   onPageChanged,
   portionSize = 10,
}) => {
   let pagesCount = Math.ceil(totalItemsCount / pageSize);

   let pages = [];
   for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
   }

   let portionCount = Math.ceil(pagesCount / portionSize);
   let [portionNumber, setPortionNumber] = useState(1);
   let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1;
   let rightPortionPageNumber = portionNumber * portionSize;

   return (
      <StyledPaginator>
         {portionNumber > 1 && (
            <button
               onClick={() => {
                  setPortionNumber(portionNumber - 1);
               }}
               className="btn btn-2"
            >
               <i className="fa fa-chevron-circle-left"></i>
            </button>
         )}

         {pages
            .filter(
               (p) => p >= leftPortionPageNumber && p <= rightPortionPageNumber
            )
            .map((p) => {
               return (
                  <StyledPageNumber>
                     <div
                        className={`pageNumber ${
                           currentPage === p ? "selectedPage" : ""
                        }`}
                        key={p}
                        onClick={(e) => {
                           onPageChanged(p);
                        }}
                     >
                        {p}
                     </div>
                  </StyledPageNumber>
               );
            })}
         {portionCount > portionNumber && (
            <button
               className="btn btn-green"
               onClick={() => {
                  setPortionNumber(portionNumber + 1);
               }}
            >
               <i className="fa fa-chevron-circle-right"></i>
            </button>
         )}
      </StyledPaginator>
   );
};

export default Paginator;
