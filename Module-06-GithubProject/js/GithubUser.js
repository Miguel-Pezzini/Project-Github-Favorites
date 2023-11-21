// Class that will capture the data from the github API

export class GithubUser {
    static search(username) {
        // Variable that will go to the URL
        const endpoint =`https://api.github.com/users/${username}`
        // Fetch is a asynchronous function
        return fetch(endpoint)
        // This .then will get the data and returns and a JSON with de json() function
        .then(data => data.json())
        // This .then will get the specific data { login, name, public_repos, followers } and put value into the login, name, public_repos, followers
        .then(({ login, name, public_repos, followers })=> ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}
