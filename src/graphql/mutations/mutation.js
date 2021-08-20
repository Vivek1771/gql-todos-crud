import { gql } from "@apollo/client"


export const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: {text: $text}) {
      returning {
        done
        id
        text
      }
    }
  }
`
export const TOGGLE_TODOS = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
      returning {
        done
        id
        text
      }
    }
  }
`
export const DELETE_TODO = gql`
  mutation DeleteTodo($id:uuid!) {
    delete_todos(where: {id: {_eq: $id}}) {
      returning {
        done
        id
        text
      }
    }
  }
`