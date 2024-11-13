class Node {

	constructor(project) {
		this.data = project;
		this.next = null;
		this.prev = null;
	}
}


export class DoublyLinkedList {

	constructor() {
		this.head = null;
		this.tail = null;
        this.size = 0;
	}

	isEmpty() {
		if (this.head == null) return true;
		return false;
	}
 
	// Method to add item at the last of doubly linked list
	add(project) {
		
		let temp = new Node(project);
           
		if (this.head == null) {
			this.head = temp;
			this.tail = temp;
		}
		
		else {
			this.tail.next = temp;
			temp.prev = this.tail;
			this.tail = this.tail.next;
		}
        this.size += 1;
	}

	removeProject(projectId) { 
        let current = this.head;
        
        while (current) { 
            if (current.data.id === projectId) {
                if (current === this.head && current === this.tail) {
                    // Only one item in the list
                    this.head = null; 
                    this.tail = null; 
                } else if (current === this.head) {
                    // Removing the head
					this.head = this.head.next;
                    this.head.prev = null;
                } else if (current === this.tail) {
                    // Removing the tail
                    this.tail = this.tail.prev;
                    this.tail.next = null;
                } else {
                    // Removing a node in the middle
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                }
                this.size--;
                return true;
            }
            current = current.next;
        }
        return false; // Project not found
    }

    insertAt(index, data) {
        const newNode = new Node(data);

        if (index === 0) {
            // Insert at the beginning
            if (this.isEmpty()) {
                this.head = newNode;
                this.tail = newNode;
            } else {
                newNode.next = this.head;
                this.head.prev = newNode;
                this.head = newNode;
            }
        } 
        else if (index === this.size)
        {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        else {
            let current = this.head;
            let currentIndex = 0;

            // Traverse to the node before the desired position
            while (currentIndex < index - 1) {
                current = current.next;
                currentIndex++;
            }

            // Insert in the middle
            newNode.next = current.next;
            newNode.prev = current;
            current.next.prev = newNode;
            current.next = newNode;
            
        }
        this.size += 1;
    }

    removeAt(index) {
        let current;

        if (index === 0) {
            // Remove from the head
            if (this.head === this.tail)
            {
                this.head = null;
                this.tail = null;
            }
            else {
                current = this.head;
                this.head = this.head.next;
                this.head.prev = null;
            }
        } else if (index === this.size - 1) {
            // Remove from the tail
            current = this.tail;
            this.tail = this.tail.prev;
            this.tail.next = null;
        } else {
            // Remove from the middle
            current = this.head;
            let currentIndex = 0;

            while (currentIndex < index) {
                current = current.next;
                currentIndex++;
            }

            current.prev.next = current.next;
            current.next.prev = current.prev;
        }

        this.size -= 1;
        return current.data; // Return the removed data
    }

	getAllProjects() {
        const projects = [];
        let current = this.head;
        while (current != null) {
            projects.push(current.project);
            current = current.next;
        }
        return projects;
    }

	clear(){
		this.head = null;
		this.tail = null;
        this.size = 0;
	}
}

