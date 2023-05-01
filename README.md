AS a senior engineer working on an e-commerce platform
I WANT my platform to use Redux to manage global state instead of the Context API
SO THAT my website's state management is taken out of the React ecosystem

GIVEN an e-commerce platform that uses Redux to manage global state
WHEN I review the app’s store - DONE
THEN I find that the app uses a Redux store instead of the Context API - DONE

WHEN I review the way the React front end accesses the store - DONE
THEN I find that the app uses a Redux provider - DONE

WHEN I review the way the app determines changes to its global state - DONE
THEN I find that the app passes reducers to a Redux store instead of using the Context API - DONE

WHEN I review the way the app extracts state data from the store - DONE
THEN I find that the app uses Redux instead of the Context API - DONE

WHEN I review the way the app dispatches actions - DONE
THEN I find that the app uses Redux instead of the Context API - DONE