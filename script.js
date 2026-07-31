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


        initializeReveal();


        initializeCardReveal();

        initializeCurrentYear();



        initializeInteractiveGrid();

    }
);







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


    const article =
        document.createElement(
            "article"
        );



    article.className =
        "work-card";



    article.innerHTML = `

        <div class="work-image">


            <img

                src="${work.image}"

                alt="${work.title}"

                loading="lazy"

            >


        </div>



        <h3 class="work-title">

            ${work.title}

        </h3>



        <div class="work-details">


            <p class="work-meta">

                ${currentTranslations[work.type]} • ${work.year}

            </p>


        </div>

    `;



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

/* ==========================================================
   LANGUAGE SYSTEM
   ========================================================== */


async function loadLanguage(language){


    try{


        const response =
            await fetch(
                `data/lang/${language}.json`
            );


        currentTranslations =
            await response.json();



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


    }catch(error){


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
                        language
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
                        language
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
                        language
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
