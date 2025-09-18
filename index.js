import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const savedTweetsBtn = document.getElementById("saved-tweets-btn");


savedTweetsBtn.addEventListener("click", function() {
    showSaveTweets();
})
 

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.option) {
        getOptionsmenu(e.target.dataset.option);
    }
    else if(e.target.dataset.delete) {
        handleDeleteTweetClick(e.target.dataset.delete)
    }
    else if(e.target.dataset.savetweet) {
        handleSaveTweet(e.target.dataset.savetweet)
    }
})


function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    
    const replyBtn = document.getElementById(`reply-btn-${replyId}`);
    replyBtn.addEventListener("click", function(){
        handleUserReply(replyId)
    })
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Mustaqeem`,
            profilePic: `images/logo.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleUserReply(tweetId) {
    const replyInput = document.getElementById(`reply-input-${tweetId}`);

    for(let tweet of tweetsData) {
        if(tweet.uuid === tweetId) {
            if(document.getElementById(`reply-input-${tweetId}`).value.trim()) {
                tweet.replies.push(
                     {
                handle: `@Mustaqeem`,
                profilePic: `images/logo.jpg`,
                tweetText: replyInput.value,
            });
        }
    }
    }
    replyInput.value = "";
    render();
}

function getOptionsmenu(tweetId) {
   for(let tweet of tweetsData) {
        if(tweetId === tweet.uuid) {
            const options = document.getElementById(`options-${tweetId}`);
            options.classList.toggle('hidden');
        }
    }
}
function handleDeleteTweetClick(tweetId) {
    for(let i = 0; i < tweetsData.length; i++) {
        if(tweetsData[i].uuid === tweetId) {
            tweetsData.splice(i, 1);
            break;
        }
    }
    render();
}

function handleSaveTweet(tweetId) {

    for(let i = 0; i < tweetsData.length; i++) {
        if(tweetsData[i].uuid === tweetId) {
            localStorage.setItem(tweetId, JSON.stringify(tweetsData[i]));
        }
    }
    const saved = localStorage.getItem(tweetId);
    console.log(JSON.parse(saved));
}

function showSaveTweets() {
    let savedTweets = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === "debug") {
            continue;
        }
        savedTweets.push(JSON.parse(localStorage.getItem(key)));
    }
    render(savedTweets);
}



function getFeedHtml(data = tweetsData){
    let feedHtml = ``
    
    data.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        

        let userReply = `
        <div class="tweet-input-area reply-input-area">
            <img src="images/logo.jpg" class="profile-pic">
            <textarea placeholder="Your reply" id="reply-input-${tweet.uuid}"></textarea>
        </div>
        <button id="reply-btn-${tweet.uuid}">Reply</button>
        `;

        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }

        let optionsHtml = `
                        <i class="fa-solid fa-ellipsis" data-option="${tweet.uuid}"></i> 
                        <div class="hidden options-menu" id="options-${tweet.uuid}"> 
                            <btn class="options-btn" data-saveTweet="${tweet.uuid}">Save Tweet</btn> 
                            <btn class="options-btn">Block</btn> 
                            <btn class="options-btn options-deleteBtn" data-delete="${tweet.uuid}">Delete</btn> 
                        </div>
                    `
          
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <div class="flex position">
                        <p class="handle">${tweet.handle}</p>
                        ${optionsHtml}
                    </div>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${userReply}
                ${repliesHtml}
            </div>   
        </div>
        `
   })
   return feedHtml 
}

function render(tweetsData){
    document.getElementById('feed').innerHTML = getFeedHtml(tweetsData)
}

render(tweetsData)

