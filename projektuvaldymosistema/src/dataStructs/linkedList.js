class Node {
    constructor(worker) {
        this.data = worker;
        this.next = null
    }
}

export class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    findNode(predicate) {
        let current = this.head;
        while (current !== null) {
            if (predicate(current.data)) {
                return current; // Return the node itself
            }
            current = current.next;
        }
        return null; // Return null if no matching node is found
    }

    // adds an worker at the end of list
    add(worker) {
        // creates a new node
        let node = new Node(worker);

        // if list is Empty add the element and make it head
        if (this.head == null)
        {
            this.head = node;
            this.tail = node;
        }
        else {
            this.tail.next = node;
            this.tail = node;
        }
        this.size++;
    }

    insertAt(element, index) {
        let node = new Node(element);
        let curr, prev;

        curr = this.head;

        // add the element to the
        // first index
        if (index == 0) {
            node.next = this.head;
            this.head = node;
        } else {
            curr = this.head;  
            let it = 0;

            while (it < index) {
                it++;
                prev = curr;
                curr = curr.next;
            }

            node.next = curr;
            prev.next = node;
        }
        this.size++;
    }

    removeFrom(index) {
            let curr, prev, it = 0;
            curr = this.head;
            prev = curr;

            // deleting first element
            if (index === 0) {
                this.head = curr.next;
            } else {
                // iterate over the list to the
                // position to remove an element
                while (it < index) {
                    it++;
                    prev = curr;
                    curr = curr.next;
                }
                // remove the element
                prev.next = curr.next;
            }
            this.size--;
            // return the remove element
            return curr.element;
    }

    // removes a given element from the
    // list
    removeElement(element) {
        let current = this.head;
        let prev = null;

        // iterate over the list
        while (current != null) {
            // comparing element with current
            // element if found then remove the
            // and return true
            if (current.element === element) {
                if (prev == null) {
                    this.head = current.next;
                } else {
                    prev.next = current.next;
                }
                this.size--;
                return current.element;
            }
            prev = current;
            current = current.next;
        }
        return -1;
    }


    // checks the list for empty
    isEmpty() {
        return this.size == 0;
    }

    // gives the size of the list
    size_of_list() {
        console.log(this.size);
    }
}
