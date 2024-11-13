import React, { useState } from 'react';
import { Text, View, Button, TextInput, Alert } from 'react-native';

const Example = () => {
    const [data, setData] = useState([]);
    const [newComment, setNewComment] = useState({ name: '', body: '' });

    const getAllData = async () => {
        const url = 'https://jsonplaceholder.typicode.com/posts/1/comments';
        const response = await fetch(url);
        const jsonData = await response.json();
        setData(jsonData);
    };

    const deleteData = (id) => {
        const updatedData = data.filter(item => item.id !== id);
        setData(updatedData);
    };

    const postData = async () => {
        const url = 'https://jsonplaceholder.typicode.com/posts/1/comments';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newComment.name,
                body: newComment.body,
            }),
        });
        const jsonData = await response.json();
        setData((prevData) => [...prevData, jsonData]);
        setNewComment({ name: '', body: '' });
    };

    return (
        <>
            <View style={{ padding: 10 }}>
                <TextInput
                    placeholder="Name"
                    value={newComment.name}
                    onChangeText={(text) => setNewComment({ ...newComment, name: text })}
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />
                <TextInput
                    placeholder="Comment Body"
                    value={newComment.body}
                    onChangeText={(text) => setNewComment({ ...newComment, body: text })}
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />
                <Button title="Post Comment" onPress={postData} />
                {
                    data.map((item) => (
                        <View key={item.id} style={{ marginBottom: 10 }}>
                            <Text>Name: {item.name}</Text>
                            <Text>Body: {item.body}</Text>
                            <Button title="Delete" onPress={() => deleteData(item.id)} />
                        </View>
                    ))
                }
            </View>
            <Button title="Fetch Comments" onPress={getAllData} />
        </>
    );
};

export default Example;
