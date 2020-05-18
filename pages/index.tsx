import Layout from '../components/Layout'
import Link from 'next/link'
import { withApollo } from '../apollo/client'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    fetch('https://atlekraft.com/api/test', { // Your POST endpoint
    method: 'POST',
    headers: {
      "Content-Type": "PNG"
    },
    body: acceptedFiles[0].path // This is your file object
  }).then(
    response => response.json() // if the response is a JSON object
  ).then(
    success => console.log("success "+success) // Handle the success response object
  ).catch(
    error => console.log("error "+error) // Handle the error response object
  );


  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

const FeedQuery = gql`
  query FeedQuery {
    feed {
      id
      title
      content
      published
      author {
        id
        name
      }
    }
  }
`

const Post = ({ post }) => (
  <Link href="/p/[id]" as={`/p/${post.id}`}>
    <a>
      <h2>{post.title}</h2>
      <small>By my friend {post.author.name}</small>
      <p>{post.content}</p>
      <style jsx>{`
        a {
          text-decoration: none;
          color: inherit;
          padding: 2rem;
          display: block;
        }
      `}</style>
    </a>
  </Link>
)



const Blog = ({ apidata }) => {
  const { loading, error, data } = useQuery(FeedQuery)

  if (loading) {
    return <div>trying to Loading ...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Blog</h1>

        <MyDropzone/>

        <input type="file" id="myfile" name="myfile"></input>

        {JSON.stringify(apidata, null, 2)}

        <main>
          {data.feed.map(post => (
            <div className="post">
              <Post key={post.id} post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}



Blog.getInitialProps = async () => {
  const resp = await fetch("https://atlekraft.com/api/test", {
    method: "POST",
  });
  const apidata = await resp.json();
  return { apidata };
};


export default withApollo(Blog)
