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
                return current;
            }
            current = current.next;
        }
        return null;
    }

    
    add(worker) {
        
        let node = new Node(worker);

        
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

    getNode(index) {
        let current = this.head;
        let currentIndex = 0;

        while (currentIndex < index) {
            current = current.next;
            currentIndex++;
        }

        return current;
    }

    isEmpty() {
        return this.size == 0;
    }

    getSize() {
        return this.size;
    }
}
