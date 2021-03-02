package example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class Listener {

    private static final String QUEUE_NAME = "QUEUE.NAME";

    @Autowired
    Environment environment;

    @JmsListener(destination = QUEUE_NAME)
    public void receiveMessage(final String msg) {
        log.info("Received message is: " + msg);

    }

}