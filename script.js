/* ==========================================================
   ARCHIVUM
   Main Script
   ========================================================== */


let currentTranslations = {};

let worksData = {};


/* ==========================================================
   INITIALIZATION
   ========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    async () => {


        loadTheme();



        initializeHeroIntro();



        const savedLanguage =
            loadSavedLanguage();



        const currentLanguage =
    savedLanguage || detectBrowserLanguage();



        await loadLanguage(
            currentLanguage
        );



        updateLanguageButton(
            currentLanguage
        );



        updateDocumentLanguage(
            currentLanguage
        );



        await loadWorks();



        initializeThemeSwitcher();


        initializeLanguageSwitcher();


        initializeSectionNavigation();


        initializeMacSectionScroll();


        initializeReveal();


        initializeCardReveal();

        initializeCurrentYear();



        initializeInteractiveGrid();

    }
);







/* ==========================================================
   HERO INTRODUCTION
   ========================================================== */


function initializeHeroIntro(){


    const title =
        document.querySelector(
            ".site-title"
        );


    const motto =
        document.querySelector(
            ".site-motto"
        );


    if(
        !title ||
        !motto
    ){


        return;


    }


    const target =
        title.textContent.trim();


    if(
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ){


        title.textContent =
            target;


        return;


    }


    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    const duration =
        680;


    const interval =
        55;


    let elapsed =
        0;


    function scrambleTitle(){


        title.textContent =
            target
                .split(
                    ""
                )
                .map(
                    (character,index) => {


                        const resolvedCharacters =
                            Math.floor(
                                elapsed /
                                (duration / target.length)
                            );


                        return index < resolvedCharacters
                            ? character
                            : alphabet[
                                Math.floor(
                                    Math.random() * alphabet.length
                                )
                            ];


                    }
                )
                .join(
                    ""
                );


    }


    motto.classList.add(
        "hero-motto-intro"
    );


    title.setAttribute(
        "aria-label",
        target
    );


    scrambleTitle();


    const timer =
        window.setInterval(
            () => {


                elapsed +=
                    interval;


                if(elapsed >= duration){


                    window.clearInterval(
                        timer
                    );


                    title.textContent =
                        target;


                    window.setTimeout(
                        () => {


                            motto.classList.add(
                                "is-visible"
                            );


                        },
                        80
                    );


                    return;


                }


                scrambleTitle();


            },
            interval
        );


}



/* ==========================================================
   INTERACTIVE BACKGROUND GRID
   ========================================================== */


function initializeInteractiveGrid(){


    const supportsHover =
        window.matchMedia(
            "(hover: hover)"
        ).matches;



    if(!supportsHover){


        return;


    }



    let animationFrame;



    window.addEventListener(
        "pointermove",
        event => {


            cancelAnimationFrame(
                animationFrame
            );



            animationFrame =
                requestAnimationFrame(
                    () => {


                        document.documentElement
                            .style.setProperty(
                                "--grid-x",
                                `${event.clientX}px`
                            );



                        document.documentElement
                            .style.setProperty(
                                "--grid-y",
                                `${event.clientY}px`
                            );


                    }
                );


        },
        { passive:true }
    );


}






/* ==========================================================
   WORKS LOADER
   ========================================================== */


async function loadWorks() {


    try {


        const response =
            await fetch(
                "data/works.json"
            );


        worksData =
            await response.json();



        createCollection(
            worksData.mainCollection,
            "main-collection"
        );



        createCollection(
            worksData.additionalWorks,
            "additional-works"
        );


    }
    catch(error) {


        console.error(
            "ARCHIVUM:",
            error
        );


    }


}








function refreshWorks(){


    const main =
        document.getElementById(
            "main-collection"
        );


    const additional =
        document.getElementById(
            "additional-works"
        );



    if(main){

        main.innerHTML = "";

    }



    if(additional){

        additional.innerHTML = "";

    }



    createCollection(
        worksData.mainCollection,
        "main-collection"
    );


    createCollection(
        worksData.additionalWorks,
        "additional-works"
    );


}








function createCollection(
    works,
    containerId
) {


    const container =
        document.getElementById(
            containerId
        );



    if(!container) {


        return;


    }



    works.forEach(
        work => {


            container.appendChild(
                createWorkCard(work)
            );


        }
    );


}








function createWorkCard(work) {


    const localizedWork = {
        ...work,
        ...(work.localizations?.[document.documentElement.lang] || {})
    };


    const title =
        localizedWork.titleKey
            ? currentTranslations[localizedWork.titleKey]
            : localizedWork.title;


    const article =
        document.createElement(
            "article"
        );



    article.className =
        "work-card";



    const availabilityOverlay =
        localizedWork.externalUrl
            ? "<div class=\"work-link-overlay\"><span class=\"work-link-caption\">" +
                currentTranslations.availableOn +
                "</span><a class=\"work-external-link\" href=\"" +
                localizedWork.externalUrl +
                "\" target=\"_blank\" rel=\"noopener noreferrer\" tabindex=\"-1\">" +
                (localizedWork.externalLabel || "External link") +
                "</a></div>"
            : "";



    article.innerHTML = `

        <div
            class="work-image${localizedWork.externalUrl ? " work-image--interactive" : ""}"
            ${localizedWork.externalUrl ? 'role="button" tabindex="0" aria-expanded="false" aria-label="Show availability link"' : ""}
        >


            <img

                src="${localizedWork.image}"

                alt="${title}"

                loading="lazy"

            >


            ${availabilityOverlay}


        </div>



        <h3 class="work-title">

            ${title}

        </h3>



        <div class="work-details">


            <p class="work-meta">

                ${currentTranslations[localizedWork.type]} • ${localizedWork.year}

            </p>


        </div>

    `;



    if(localizedWork.externalUrl){


        const image =
            article.querySelector(
                ".work-image--interactive"
            );


        const link =
            article.querySelector(
                ".work-external-link"
            );


        const toggleAvailability = () => {


            const isOpen =
                article.classList.toggle(
                    "is-availability-open"
                );


            image.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            link.setAttribute(
                "tabindex",
                isOpen ? "0" : "-1"
            );


        };


        image.addEventListener(
            "click",
            toggleAvailability
        );


        image.addEventListener(
            "keydown",
            event => {


                if(
                    event.key === "Enter" ||
                    event.key === " "
                ){


                    event.preventDefault();
                    toggleAvailability();


                }


            }
        );


        link.addEventListener(
            "click",
            event => event.stopPropagation()
        );


    }


    return article;


}





/* ==========================================================
   THEME SYSTEM
   ========================================================== */


function loadTheme(){


    const savedTheme =
        localStorage.getItem(
            "archivum-theme"
        );



    const systemDarkMode =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;



    const currentTheme =
        savedTheme ||
        (
            systemDarkMode
                ? "dark"
                : "light"
        );



    if(
        currentTheme === "dark"
    ){


        document.documentElement
            .setAttribute(
                "data-theme",
                "dark"
            );


        updateThemeIcon(
            true
        );


    }else{


        document.documentElement
            .removeAttribute(
                "data-theme"
            );


        updateThemeIcon(
            false
        );


    }


}









function initializeThemeSwitcher(){


    const button =
        document.querySelector(
            ".theme-button"
        );



    if(!button){


        return;


    }



    button.addEventListener(
        "click",
        () => {


            const dark =
                document.documentElement
                    .getAttribute(
                        "data-theme"
                    )
                === "dark";



            if(dark){


                document.documentElement
                    .removeAttribute(
                        "data-theme"
                    );



                localStorage.setItem(
                    "archivum-theme",
                    "light"
                );



                updateThemeIcon(
                    false
                );


            }
            else{


                document.documentElement
                    .setAttribute(
                        "data-theme",
                        "dark"
                    );



                localStorage.setItem(
                    "archivum-theme",
                    "dark"
                );



                updateThemeIcon(
                    true
                );


            }


        }
    );


}









function updateThemeIcon(
    dark
){


    const button =
        document.querySelector(
            ".theme-button"
        );



    if(!button){


        return;


    }



    button.textContent =
        dark
            ? "☀"
            : "☾";


}


/* ==========================================================
   CURRENT YEAR
   ========================================================== */


function initializeCurrentYear(){


    console.log(
        "CURRENT YEAR START"
    );



    const year =
        document.querySelector(
            "#current-year"
        );



    console.log(
        year
    );



    if(!year){


        return;


    }



    year.textContent =
        new Date()
            .getFullYear();


}




/* ==========================================================
   MACOS DESKTOP SECTION SCROLL
   ========================================================== */


function initializeMacSectionScroll(){


    const isMacDesktop =
        /Mac/.test(navigator.platform) &&
        window.matchMedia("(min-width: 769px) and (pointer: fine)").matches &&
        navigator.maxTouchPoints === 0;


    if(
        !isMacDesktop ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ){


        return;


    }


    const sections =
        Array.from(
            document.querySelectorAll(
                ".hero, .featured-exhibit, .section"
            )
        );


    if(sections.length === 0){


        return;


    }


    document.documentElement.classList.add(
        "mac-smooth-section-scroll"
    );


    let isAnimating =
        false;


    let gestureEndTimer;


    let scrollSettleTimer;


    let isGestureActive =
        false;


    let isScrolling =
        false;


    function releaseWhenSettled(){


        if(
            !isGestureActive &&
            !isScrolling
        ){


            isAnimating =
                false;


        }


    }


    function markGestureActivity(){


        isGestureActive =
            true;


        window.clearTimeout(
            gestureEndTimer
        );


        gestureEndTimer =
            window.setTimeout(
                () => {


                    isGestureActive =
                        false;


                    releaseWhenSettled();


                },
                120
            );


    }


    window.addEventListener(
        "scroll",
        () => {


            if(!isAnimating){


                return;


            }


            isScrolling =
                true;


            window.clearTimeout(
                scrollSettleTimer
            );


            scrollSettleTimer =
                window.setTimeout(
                    () => {


                        isScrolling =
                            false;


                        releaseWhenSettled();


                    },
                    100
                );


        },
        { passive:true }
    );


    function getCurrentSectionIndex(){


        let closestIndex =
            0;


        let closestDistance =
            Infinity;


        sections.forEach(
            (section,index) => {


                const distance =
                    Math.abs(
                        section.getBoundingClientRect().top
                    );


                if(distance < closestDistance){


                    closestDistance =
                        distance;


                    closestIndex =
                        index;


                }


            }
        );


        return closestIndex;


    }


    window.addEventListener(
        "wheel",
        event => {


            if(event.ctrlKey){


                return;


            }


            event.preventDefault();


            markGestureActivity();


            if(isAnimating){


                return;


            }


            if(event.deltaY === 0){


                return;


            }


            const direction =
                event.deltaY > 0
                    ? 1
                    : -1;


            const currentIndex =
                getCurrentSectionIndex();


            const targetIndex =
                Math.max(
                    0,
                    Math.min(
                        sections.length - 1,
                        currentIndex + direction
                    )
                );



            if(targetIndex === currentIndex){


                return;


            }


            isAnimating =
                true;


            sections[targetIndex].scrollIntoView(
                {


                    behavior:"smooth",
                    block:"start"


                }
            );





        },
        { passive:false }
    );


}





/* ==========================================================
   SECTION NAVIGATION
   ========================================================== */


function initializeSectionNavigation() {


    const navigation =
        document.querySelector(
            ".section-navigation"
        );


    const dots =
        document.querySelectorAll(
            ".nav-dot"
        );


    const sections =
        document.querySelectorAll(
            ".hero, .featured-exhibit, .section"
        );



    if(
        !navigation ||
        dots.length === 0
    ) {


        return;


    }



    let timer;



    function showNavigation(){


        navigation.classList.add(
            "visible"
        );



        clearTimeout(timer);



        timer =
            setTimeout(
                () => {


                    navigation.classList.remove(
                        "visible"
                    );


                },
                5000
            );


    }






    window.addEventListener(
        "scroll",
        () => {


            showNavigation();



            let current =
                0;



            sections.forEach(
                (section,index) => {


                    const rect =
                        section.getBoundingClientRect();



                    if(
                        rect.top <=
                        window.innerHeight / 2
                    ) {


                        current =
                            index;


                    }


                }
            );



            dots.forEach(
                (dot,index) => {


                    dot.classList.toggle(
                        "active",
                        index === current
                    );


                }
            );

            document.body.classList.toggle(
                "banner-focus",
                current === 1
            );


        }
    );







    dots.forEach(
        dot => {


            dot.addEventListener(
                "click",
                () => {


                    const index =
                        Number(
                            dot.dataset.section
                        );



                    if(sections[index]) {


                        sections[index]
                            .scrollIntoView(
                                {
                                    behavior:
                                        "smooth"
                                }
                            );


                    }


                }
            );


        }
    );


}









/* ==========================================================
   WORK CARD REVEAL
   ========================================================== */


function initializeCardReveal(){


    const cards =
        document.querySelectorAll(
            ".work-card"
        );



    if(cards.length === 0) {


        return;


    }




    const observer =
        new IntersectionObserver(
            entries => {


                entries.forEach(
                    entry => {


                        if(
                            entry.isIntersecting
                        ) {


                            entry.target
                                .classList
                                .add(
                                    "visible"
                                );


                        }


                    }
                );


            },
            {
                threshold:.25
            }
        );





    cards.forEach(
        card => {


            observer.observe(
                card
            );


        }
    );


}

/* ==========================================================
   SECTION REVEAL
   ========================================================== */


function initializeReveal(){


    const elements =
        document.querySelectorAll(
            ".reveal, .reveal-author"
        );



    if(elements.length === 0){

        return;

    }



    const observer =
        new IntersectionObserver(
            entries => {


                entries.forEach(
                    entry => {


                        if(entry.isIntersecting){


                            entry.target.classList.add(
                                "visible"
                            );




                            if(
                                entry.target.classList.contains(
                                    "reveal-author"
                                )
                            ){


                                startAuthorTyping(
                                    entry.target
                                );


                            }


                        }


                    }
                );


            },
            {
                threshold:.2
            }
        );



    elements.forEach(
        element => {


            observer.observe(
                element
            );


        }
    );


}

function updateFeaturedBanner(language) {


    const desktopBanner =
        document.querySelector(
            ".hero-banner-desktop"
        );


    if(!desktopBanner) {


        return;


    }


    desktopBanner.src =
        language === "en"
            ? "images/banner/Soon-banner.webp"
            : "images/banner/Novel1-banner.webp";


}





/* ==========================================================
   LANGUAGE SYSTEM
   ========================================================== */


async function loadLanguage(
    language,
    animate = false
){


    if(animate){


        document.body.classList.add(
            "language-changing"
        );


        await new Promise(
            resolve => setTimeout(
                resolve,
                140
            )
        );


    }


    try{


        const response =
            await fetch(
                `data/lang/${language}.json`
            );


        currentTranslations =
            await response.json();



        updateFeaturedBanner(
            language
        );



        updateDocumentLanguage(
            language
        );



        document
            .querySelectorAll(
                "[data-lang]"
            )
            .forEach(
                element => {


                    const key =
                        element.dataset.lang;



                    if(currentTranslations[key]){


                        if(
                            element.classList.contains(
                                "author-text"
                            )
                        ){


                            updateAuthorText(
                                element,
                                currentTranslations[key]
                            );


                        }else{


                            element.textContent =
                                currentTranslations[key];


                        }


                    }


                }
            );



    if(animate){


        requestAnimationFrame(
            () => {


                document.body.classList.remove(
                    "language-changing"
                );


            }
        );


    }


    }catch(error){


        if(animate){


            document.body.classList.remove(
                "language-changing"
            );


        }


        console.error(
            "Language:",
            error
        );


    }


}




/* ==========================================================
   AUTHOR TYPING ANIMATION
   ========================================================== */


function updateAuthorText(
    element,
    text
){


    let textElement =
        element.querySelector(
            "span"
        );



    if(!textElement){


        textElement =
            document.createElement(
                "span"
            );



        element.appendChild(
            textElement
        );


    }



    textElement.dataset.fullText =
        text;



    if(
        element.dataset.typed === "true"
    ){


        textElement.textContent =
            text;


    }else{


        textElement.textContent =
            "";


    }


}






function startAuthorTyping(
    authorProfile
){


    const text =
        authorProfile.querySelector(
            ".author-text"
        );



    const textElement =
        text?.querySelector(
            "span"
        );



    if(
        !text ||
        !textElement ||
        text.dataset.typed === "true" ||
        text.dataset.typing === "true"
    ){


        return;


    }



    const fullText =
        textElement.dataset.fullText ||
        textElement.textContent;



    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;



    if(reduceMotion){


        textElement.textContent =
            fullText;



        text.dataset.typed =
            "true";



        return;


    }



    textElement.textContent =
        "";



    text.dataset.typing =
        "true";



    textElement.classList.add(
        "typing"
    );



    let index = 0;



    function typeNextCharacter(){


        textElement.textContent +=
            fullText.charAt(
                index
            );



        index += 1;



        if(index < fullText.length){


            setTimeout(
                typeNextCharacter,
                24
            );


        }else{


            textElement.classList.remove(
                "typing"
            );



            text.dataset.typed =
                "true";


        }


    }



    setTimeout(
        typeNextCharacter,
        500
    );


}






/* ==========================================================
   SAVED LANGUAGE
   ========================================================== */


function loadSavedLanguage(){


    const savedLanguage =
        localStorage.getItem(
            "archivum-language"
        );



    return savedLanguage;


}









/* ==========================================================
   DETECT BROWSER LANGUAGE
   ========================================================== */


function detectBrowserLanguage(){


    const browserLanguage =
        navigator.language
            .toLowerCase();



    if(
        browserLanguage.startsWith("pl")
    ){


        return "pl";


    }



    return "en";


}









/* ==========================================================
   UPDATE LANGUAGE BUTTON
   ========================================================== */


function updateLanguageButton(
    language
){


    const buttons =
        document.querySelectorAll(
            ".language-button"
        );



    buttons.forEach(
        button => {


            const buttonLanguage =
                button.textContent
                    .trim()
                    .toLowerCase();



            button.classList.toggle(
                "active",
                buttonLanguage === language
            );


        }
    );


}









/* ==========================================================
   UPDATE DOCUMENT LANGUAGE
   ========================================================== */


function updateDocumentLanguage(
    language
){


    document.documentElement
        .setAttribute(
            "lang",
            language
        );


}









/* ==========================================================
   LANGUAGE SWITCHER
   ========================================================== */


function initializeLanguageSwitcher(){


    const buttons =
        document.querySelectorAll(
            ".language-button"
        );



    buttons.forEach(
        button => {


            button.addEventListener(
                "click",
                async () => {


                    const language =
                        button.textContent
                            .trim()
                            .toLowerCase();



                    await loadLanguage(
                        language,
                        true
                    );



                    refreshWorks();



                    localStorage.setItem(
                        "archivum-language",
                        language
                    );



                    updateLanguageButton(
                        language
                    );



                    updateDocumentLanguage(
                        language
                    );


                }
            );


        }
    );


}









/* ==========================================================
   SAVED LANGUAGE
   ========================================================== */


function loadSavedLanguage(){


    const savedLanguage =
        localStorage.getItem(
            "archivum-language"
        );



    return savedLanguage;


}









/* ==========================================================
   DETECT BROWSER LANGUAGE
   ========================================================== */


function detectBrowserLanguage(){


    const browserLanguage =
        navigator.language
            .toLowerCase();



    if(
        browserLanguage.startsWith("pl")
    ){


        return "pl";


    }



    return "en";


}









/* ==========================================================
   UPDATE LANGUAGE BUTTON
   ========================================================== */


function updateLanguageButton(
    language
){


    const buttons =
        document.querySelectorAll(
            ".language-button"
        );



    buttons.forEach(
        button => {


            const buttonLanguage =
                button.textContent
                    .trim()
                    .toLowerCase();



            button.classList.toggle(
                "active",
                buttonLanguage === language
            );


        }
    );


}









/* ==========================================================
   LANGUAGE SWITCHER
   ========================================================== */


function initializeLanguageSwitcher(){


    const buttons =
        document.querySelectorAll(
            ".language-button"
        );



    buttons.forEach(
        button => {


            button.addEventListener(
                "click",
                async () => {


                    const language =
                        button.textContent
                            .trim()
                            .toLowerCase();



                    await loadLanguage(
                        language,
                        true
                    );



                    localStorage.setItem(
                        "archivum-language",
                        language
                    );



                    updateLanguageButton(
                        language
                    );


                }
            );


        }
    );


}

/* ==========================================================
   LANGUAGE SWITCHER
   ========================================================== */


function initializeLanguageSwitcher(){


    const buttons =
        document.querySelectorAll(
            ".language-button"
        );



    buttons.forEach(
        button => {


            button.addEventListener(
                "click",
                async () => {


                    const language =
                        button.textContent
                            .trim()
                            .toLowerCase();



                    await loadLanguage(
                        language,
                        true
                    );



                    refreshWorks();



                    initializeCardReveal();



                    localStorage.setItem(
                        "archivum-language",
                        language
                    );



                    buttons.forEach(
                        item => {


                            item.classList.remove(
                                "active"
                            );


                        }
                    );



                    button.classList.add(
                        "active"
                    );



                    updateDocumentLanguage(
                        language
                    );


                }
            );


        }
    );


}

/* ==========================================================
   SAVED LANGUAGE
   ========================================================== */


function loadSavedLanguage(){


    const savedLanguage =
        localStorage.getItem(
            "archivum-language"
        );



    return savedLanguage;


}

/* ==========================================================
   UPDATE LANGUAGE BUTTON
   ========================================================== */


function updateLanguageButton(
    language
){


    const buttons =
        document.querySelectorAll(
            ".language-button"
        );



    buttons.forEach(
        button => {


            const buttonLanguage =
                button.textContent
                    .trim()
                    .toLowerCase();



            button.classList.toggle(
                "active",
                buttonLanguage === language
            );


        }
    );


}
