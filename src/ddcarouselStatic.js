class DDCarouselStatic {
    version = 0.1;
    element = null; // element housing the carousel
    originalItems = [] //array of carousel item for pagination
    items = []; //array of carousel item
    size = 3; //number of item per page
    gap = 15; 
    width = 0;
    currentPage = 1;
    previousPage = 0;
    touchStartX = 0;
    touchEndX = 0;

    constructor(_element) {
        this.element = _element;
        this.items = _element.getElementsByClassName("ddcarousel_item_fix_position");
        this.originalItems = Object.assign([], this.items);
        
        //set listener for navigation to left/right
        const navigationLeftRight = this.element.parentElement.getElementsByClassName("ddcarousel_nav_item_fix_position");
        for(let i = 0; i < navigationLeftRight.length; i++) {
            navigationLeftRight[i].addEventListener("click", () => this.move(navigationLeftRight[i]));
        }

        //set listener for touch event on mobile
        this.element.addEventListener('touchstart', (event) => this.handleTouchStart(event));
        this.element.addEventListener('touchend', (event) => this.handleTouchEnd(event, this));
        this.init();
    }

    async init() {
        await this.setMinItems();//set minimum item to (size + 2), max size is 3 and other 2 for previous and next item
        this.width = await this.getSize();
        // this.el.style.height = this.items[0].clientHeight + "px";
        this.element.style.height = "auto";
        
        await this.buildPagination();//build-up the pagination item

        await this.clone("previous");//to set the first item display
        await this.buildPosition();
    }

    async setMinItems() {
        const minItems = this.size + 2;
        if(this.items.length < minItems) {
            let itemsLength = this.items.length;
            for(let i = 0; i < itemsLength; i++) {
                let carousel = this.items[i].cloneNode(true);
                this.element.append(carousel);
            }
        }
        if(this.items.length < minItems) {
            await this.setMinItems();
        }
        
    }

    async getSize() {
        let width = this.element.clientWidth;
        width = width / this.size - this.gap;
        return width;
    }

    //Present the carousel and re-render after moving to next/previous carousel
    async buildPosition() {
        let left = this.width * -1;
        for(let i = 0; i < this.items.length; i++) {
            this.items[i].style.width = this.width + "px";
            this.items[i].style.left = left + "px";
            left = left + this.width;
            if(i > 0) {
                left = left + this.gap;
            }
        }
    }

    async buildPagination() {
        const pageCount = Math.ceil(this.items.length / this.size);
        
        await this.getPaginationNumbers(pageCount);//set number of pagination item
        await this.setCurrentPage(1);//set active for the first page as default
        
        const pagination = this.element.parentElement.getElementsByClassName("pagination-number");
        
        //set listener for pagination item
        for(let i = 0; i < pagination.length; i++) {
            const pageIndex = Number(pagination[i].getAttribute("data-page-index"));        
            if (pageIndex) {
                pagination[i].addEventListener("click", () => {
                    this.setCurrentPage(pageIndex);
                    this.goToPage(pageIndex);
                });
            }
        }
    }

    //set activate pagination item
    async setActivePaginationItem() {
        document.querySelectorAll(".pagination-number").forEach((navPage) => {
            navPage.classList.remove("active");
            const pageIndex = Number(navPage.getAttribute("data-page-index"));
            if (pageIndex == this.currentPage) {
              navPage.classList.add("active");
            }
        });
    }

    appendPageNav(index) {
        const pageNav = document.createElement("div");
        pageNav.className = "pagination-number";
        pageNav.setAttribute("data-page-index", index);
        pageNav.setAttribute("aria-label", "Page " + index);
        return pageNav;
    }    

    //get the container housing and append the pagination items to the container
    async getPaginationNumbers(pageCount) {
        const paginationNumbers = this.element.parentElement.getElementsByClassName("pagination-numbers");
        let pageNav = null;
        for (let i = 1; i <= pageCount; i++) {
            pageNav = this.appendPageNav(i);
            paginationNumbers[0].appendChild(pageNav);
        }
    }

    async setCurrentPage(pageNum) {
        this.previousPage = this.currentPage;
        this.currentPage = pageNum;
        this.setActivePaginationItem();
    }

    //append/prepend a node to the list item carousel before go to next/previous carousel item
    async clone(position = "next") {
        let item = 0;
        if(position === "next") {
            item = this.items[0];
        } else {
            item = this.items[this.items.length - 1];
        }

        let carousel = item.cloneNode(true);

        if(position === "next") {
            this.element.append(carousel);
        } else {
            this.element.prepend(carousel);
        }

        item.remove();
    }

    //event for the navigation to previous/next carousel
    async move(el) {
        let position = el.getAttribute("data-dir");
        if(position === "next") {
            this.next();
        } else {
            this.previous();
        }
    }

    //event for pagination item
    async goToPage(page = 1) {
        await this.resetCarousel();
        let length = (page - 1) * this.size;
        for(let i = 0; i < length; i++){
            this.next();
        }
    }

    //ultility function to reset the order of carousel items
    async resetCarousel() {
        for(let i = this.originalItems.length - 1; i >= 0; i--) {
            this.items[i].remove();
        }
        for(let i = 0; i < this.originalItems.length; i++) {
            this.element.append(this.originalItems[i].cloneNode(true));
        }
        await this.clone("previous");
        await this.buildPosition();
    }

    //moving to the next carousel item
    async next() {
        await this.clone("next");
        await this.buildPosition();
    }

    //moving to the previous carousel item
    async previous() {
        await this.clone("pev");
        await this.buildPosition();
    }

    //Handle touch event on mobile    
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    }

    handleTouchEnd(event, _this) {
      this.touchEndX = event.changedTouches[0].clientX;
      _this.handleSwipe(_this);
    }

    handleSwipe(_this) {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
  
        if (swipeDistance > swipeThreshold) {
            _this.prev();
        } else if (swipeDistance < -swipeThreshold) {
            _this.next();
        }
    }
    
}


const element = document.getElementById("carouselStatic");
new DDCarouselStatic(element);